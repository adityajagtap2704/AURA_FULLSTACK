// Load environment variables
import dotenv from 'dotenv';
dotenv.config(); // Loads from .env by default

import { Worker, Job, ConnectionOptions } from 'bullmq';
import { connection } from './index';
import { GoogleConnector } from '@/lib/connectors/google';
import { NotionConnector } from '@/lib/connectors/notion';
import { supabaseServer } from '@/lib/supabase/server';

interface SyncJobData {
  userId: string;
  tenantId: string;
  connector: 'google' | 'notion';
}

// Sync worker that processes all connector jobs
export const syncWorker = new Worker<SyncJobData>(
  'sync',
  async (job: Job<SyncJobData>) => {
    const { userId, tenantId, connector } = job.data;

    console.log(`[Sync Worker] Processing ${connector} sync for user ${userId}`);

    // Create sync job record
    const { data: syncJob } = await supabaseServer
      .from('sync_jobs')
      .insert({
        tenant_id: tenantId,
        connector,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    try {
      let connectorInstance: GoogleConnector | NotionConnector;

      // Select connector based on type
      switch (connector) {
        case 'google':
          connectorInstance = new GoogleConnector();
          break;
        case 'notion':
          connectorInstance = new NotionConnector();
          break;
        default:
          throw new Error(`Unknown connector: ${connector}`);
      }

      // Fetch raw data
      const rawData = await connectorInstance.fetch(userId);

      // Map to canonical format
      const canonicalData = await connectorInstance.mapToCanonical(rawData, tenantId);

      // Persist to database
      let itemsSynced = 0;

      // Upsert tasks, then delete anything from this source that's no
      // longer present upstream (removed in Notion since the last sync).
      // A prior delete-then-insert pair raced under concurrent syncs for
      // the same tenant — two overlapping jobs (e.g. rapid repeated "Sync
      // Now" clicks with worker concurrency: 5) could interleave their
      // delete and insert, so one job's insert collided with rows the
      // other had just written (23505 duplicate key). Upsert has no such
      // window: it's a single atomic statement per row regardless of what
      // else is running concurrently.
      if (canonicalData.tasks.length > 0) {
        const tasksToUpsert = canonicalData.tasks.map(task => ({
          ...task,
          tenant_id: tenantId,
        }));

        const { error } = await supabaseServer
          .from('tasks')
          .upsert(tasksToUpsert, { onConflict: 'tenant_id,source,source_id' });

        if (error) {
          console.error('[Sync Worker] Error upserting tasks:', error);
        } else {
          itemsSynced += canonicalData.tasks.length;

          const sources = [...new Set(canonicalData.tasks.map(t => t.source))];
          for (const source of sources) {
            const currentIds = canonicalData.tasks
              .filter(t => t.source === source)
              .map(t => t.source_id);

            await supabaseServer
              .from('tasks')
              .delete()
              .eq('tenant_id', tenantId)
              .eq('source', source)
              .not('source_id', 'in', `(${currentIds.join(',')})`);
          }
        }
      }

      // Insert events — be tolerant of missing columns in DB schema (e.g., color)
      if (canonicalData.events.length > 0) {
        let eventsToInsert = canonicalData.events.map((event) => ({
          ...event,
          tenant_id: tenantId,
        }));

        // Try upsert, and if PostgREST reports a missing column (PGRST204),
        // remove that column from the payload and retry. This makes the
        // worker resilient to schema drift in development environments.
        let attempt = 0;
        while (attempt < 3) {
          attempt += 1;
          const { error } = await supabaseServer
            .from('events')
            .upsert(eventsToInsert, {
              onConflict: 'tenant_id,source,source_id',
            });

          if (!error) {
            itemsSynced += canonicalData.events.length;
            
            // Clean up Google Calendar events that were deleted upstream within the sync window
            const googleEvents = canonicalData.events.filter(e => e.source === 'google_calendar');
            if (googleEvents.length > 0) {
              const currentIds = googleEvents.map(e => e.source_id);
              const now = new Date();
              const thirtyDaysAgo = new Date(now);
              thirtyDaysAgo.setDate(now.getDate() - 30);
              const ninetyDaysFromNow = new Date(now);
              ninetyDaysFromNow.setDate(now.getDate() + 90);

              const { error: deleteError } = await supabaseServer
                .from('events')
                .delete()
                .eq('tenant_id', tenantId)
                .eq('source', 'google_calendar')
                .gte('start_time', thirtyDaysAgo.toISOString())
                .lte('start_time', ninetyDaysFromNow.toISOString())
                .not('source_id', 'in', `(${currentIds.join(',')})`);

              if (deleteError) {
                console.error('[Sync Worker] Error deleting removed Google Calendar events:', deleteError);
              }
            }
            break;
          }

          console.error('[Sync Worker] Error inserting events:', error);

          // If PostgREST reports a missing column, try to parse it and remove
          // that property from the objects, then retry.
          if (error.code === 'PGRST204' && typeof error.message === 'string') {
            const m = error.message.match(/Could not find the '([^']+)' column/);
            if (m && m[1]) {
              const missingCol = m[1];
              console.warn(`[Sync Worker] Detected missing column '${missingCol}', stripping it from events and retrying`);
              eventsToInsert = eventsToInsert.map((e) => {
                const copy = { ...e } as any;
                delete copy[missingCol];
                return copy;
              }) as any;
              // continue to retry
              continue;
            }
          }

          // For any other error or if we couldn't parse the missing column,
          // stop retrying to avoid an infinite loop.
          break;
        }
      }

      // Insert messages
      if (canonicalData.messages.length > 0) {
        const messagesToInsert = canonicalData.messages.map(message => ({
          ...message,
          tenant_id: tenantId,
        }));

        const { error } = await supabaseServer
          .from('messages')
          .upsert(messagesToInsert, {
            onConflict: 'tenant_id,source,source_id',
          });

        if (error) {
          console.error('[Sync Worker] Error inserting messages:', error);
        } else {
          itemsSynced += canonicalData.messages.length;
          
          // Clean up Gmail messages that are no longer returned by the active sync queries (meaning they were deleted or unstarred/unmarked)
          const gmailMessages = canonicalData.messages.filter(m => m.source === 'gmail');
          if (gmailMessages.length > 0) {
            const currentIds = gmailMessages.map(m => m.source_id);
            const { error: deleteError } = await supabaseServer
              .from('messages')
              .delete()
              .eq('tenant_id', tenantId)
              .eq('source', 'gmail')
              .not('source_id', 'in', `(${currentIds.join(',')})`);

            if (deleteError) {
              console.error('[Sync Worker] Error deleting removed Gmail messages:', deleteError);
            }
          }
        }
      }

      // Insert documents
      if (canonicalData.documents.length > 0) {
        const documentsToInsert = canonicalData.documents.map(document => ({
          ...document,
          tenant_id: tenantId,
        }));

        const { error } = await supabaseServer
          .from('documents')
          .upsert(documentsToInsert, {
            onConflict: 'tenant_id,source,source_id',
          });

        if (error) {
          console.error('[Sync Worker] Error inserting documents:', error);
        } else {
          itemsSynced += canonicalData.documents.length;
        }
      }

      // Update sync job as completed
      await supabaseServer
        .from('sync_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          items_synced: itemsSynced,
        })
        .eq('id', syncJob!.id);

      console.log(`[Sync Worker] Completed ${connector} sync: ${itemsSynced} items synced`);

      return { success: true, itemsSynced };
    } catch (error) {
      console.error(`[Sync Worker] Error during ${connector} sync:`, error);

      // Update sync job as failed
      await supabaseServer
        .from('sync_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: (error as Error).message,
        })
        .eq('id', syncJob!.id);

      throw error; // Re-throw for BullMQ retry mechanism
    }
  },
  {
    connection: connection as unknown as ConnectionOptions,
    concurrency: 5, // Process up to 5 sync jobs concurrently
  }
);

// Worker event handlers
syncWorker.on('completed', (job) => {
  console.log(`[Sync Worker] Job ${job.id} completed successfully`);
});

syncWorker.on('failed', (job, err) => {
  console.error(`[Sync Worker] Job ${job?.id} failed:`, err.message);
});

syncWorker.on('error', (err) => {
  console.error('[Sync Worker] Worker error:', err);
});

console.log('[Sync Worker] Started and ready to process sync jobs');

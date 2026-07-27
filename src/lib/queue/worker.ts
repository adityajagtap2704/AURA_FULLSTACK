import { Worker, Job, ConnectionOptions } from 'bullmq';
import { indexTenantEmbeddings } from '@/lib/embeddings/index-tenant';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local', override: true });


import { connection } from './index';
import { GoogleConnector } from '@/lib/connectors/google';
import { NotionConnector } from '@/lib/connectors/notion';
import { supabaseServer } from '@/lib/supabase/server';
import { generateEmbeddingsForRecord } from '../../../aiml/search_embedding/pipeline';

interface SyncJobData {
  userId: string;
  tenantId: string;
  connector: 'google' | 'notion';
}

// Sync worker that processes all connector jobs
export const syncWorker = new Worker<SyncJobData>(
  'sync',
  async (job: Job<SyncJobData>) => {
    const {
      userId,
      tenantId,
      connector,
    } = job.data;

    console.log(
      `[Sync Worker] Processing ${connector} sync for user ${userId}`,
    );

    // Create sync job record
    const {
      data: syncJob,
      error: syncJobError,
    } = await supabaseServer
      .from('sync_jobs')
      .insert({
        tenant_id: tenantId,
        connector,
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (syncJobError || !syncJob) {
      throw new Error(
        syncJobError?.message ??
          'Failed to create sync job record.',
      );
    }

    try {
      let connectorInstance:
        | GoogleConnector
        | NotionConnector;

      switch (connector) {
        case 'google':
          connectorInstance = new GoogleConnector();
          break;

        case 'notion':
          connectorInstance = new NotionConnector();
          break;

        default:
          throw new Error(
            `Unknown connector: ${connector}`,
          );
      }

      // Fetch raw connector data
      const rawData =
        await connectorInstance.fetch(userId);

      // Convert to canonical format
      const canonicalData =
        await connectorInstance.mapToCanonical(
          rawData,
          tenantId,
        );

      let itemsSynced = 0;

      /*
       * Tasks
       */
      if (canonicalData.tasks.length > 0) {
        const tasksToUpsert =
          canonicalData.tasks.map((task) => ({
            ...task,
            tenant_id: tenantId,
          }));

        const { error: tasksError } =
          await supabaseServer
            .from('tasks')
            .upsert(tasksToUpsert, {
              onConflict:
                'tenant_id,source,source_id',
            });

        if (tasksError) {
          console.error(
            '[Sync Worker] Error upserting tasks:',
            tasksError,
          );
        } else {
          itemsSynced +=
            canonicalData.tasks.length;

          const sources = [
            ...new Set(
              canonicalData.tasks.map(
                (task) => task.source,
              ),
            ),
          ];

          for (const source of sources) {
            const currentIds =
              canonicalData.tasks
                .filter(
                  (task) =>
                    task.source === source,
                )
                .map(
                  (task) => task.source_id,
                );

            if (currentIds.length > 0) {
              const { error: deleteError } =
                await supabaseServer
                  .from('tasks')
                  .delete()
                  .eq(
                    'tenant_id',
                    tenantId,
                  )
                  .eq('source', source)
                  .not(
                    'source_id',
                    'in',
                    `(${currentIds.join(',')})`,
                  );

              if (deleteError) {
                console.error(
                  '[Sync Worker] Error deleting removed tasks:',
                  deleteError,
                );
              }
            }
          }
        }
      }

      /*
       * Events
       */
      if (canonicalData.events.length > 0) {
        let eventsToInsert =
          canonicalData.events.map(
            (event) => ({
              ...event,
              tenant_id: tenantId,
            }),
          );

        let attempt = 0;

        while (attempt < 3) {
          attempt += 1;

          const { error: eventsError } =
            await supabaseServer
              .from('events')
              .upsert(eventsToInsert, {
                onConflict:
                  'tenant_id,source,source_id',
              });

          if (!eventsError) {
            itemsSynced +=
              canonicalData.events.length;

            const googleEvents =
              canonicalData.events.filter(
                (event) =>
                  event.source ===
                  'google_calendar',
              );

            if (googleEvents.length > 0) {
              const currentIds =
                googleEvents.map(
                  (event) =>
                    event.source_id,
                );

              const now = new Date();

              const thirtyDaysAgo =
                new Date(now);
              thirtyDaysAgo.setDate(
                now.getDate() - 30,
              );

              const ninetyDaysFromNow =
                new Date(now);
              ninetyDaysFromNow.setDate(
                now.getDate() + 90,
              );

              const {
                error: deleteError,
              } = await supabaseServer
                .from('events')
                .delete()
                .eq(
                  'tenant_id',
                  tenantId,
                )
                .eq(
                  'source',
                  'google_calendar',
                )
                .gte(
                  'start_time',
                  thirtyDaysAgo.toISOString(),
                )
                .lte(
                  'start_time',
                  ninetyDaysFromNow.toISOString(),
                )
                .not(
                  'source_id',
                  'in',
                  `(${currentIds.join(',')})`,
                );

              if (deleteError) {
                console.error(
                  '[Sync Worker] Error deleting removed Google Calendar events:',
                  deleteError,
                );
              }
            }

            break;
          }

          console.error(
            '[Sync Worker] Error inserting events:',
            eventsError,
          );

          if (
            eventsError.code === 'PGRST204' &&
            typeof eventsError.message ===
              'string'
          ) {
            const match =
              eventsError.message.match(
                /Could not find the '([^']+)' column/,
              );

            if (match?.[1]) {
              const missingColumn =
                match[1];

              console.warn(
                `[Sync Worker] Detected missing column '${missingColumn}', stripping it from events and retrying`,
              );

              eventsToInsert =
                eventsToInsert.map(
                  (event) => {
                    const copy = {
                      ...event,
                    } as Record<
                      string,
                      unknown
                    >;

                    delete copy[
                      missingColumn
                    ];

                    return copy;
                  },
                ) as typeof eventsToInsert;

              continue;
            }
          }

          break;
        }
      }

      /*
       * Messages
       */
      if (
        canonicalData.messages.length > 0
      ) {
        const messagesToInsert =
          canonicalData.messages.map(
            (message) => ({
              ...message,
              tenant_id: tenantId,
            }),
          );

        const { error: messagesError } =
          await supabaseServer
            .from('messages')
            .upsert(messagesToInsert, {
              onConflict:
                'tenant_id,source,source_id',
            });

        if (messagesError) {
          console.error(
            '[Sync Worker] Error inserting messages:',
            messagesError,
          );
        } else {
          itemsSynced +=
            canonicalData.messages.length;

          const gmailMessages =
            canonicalData.messages.filter(
              (message) =>
                message.source === 'gmail',
            );

          if (gmailMessages.length > 0) {
            const currentIds =
              gmailMessages.map(
                (message) =>
                  message.source_id,
              );

            const {
              error: deleteError,
            } = await supabaseServer
              .from('messages')
              .delete()
              .eq(
                'tenant_id',
                tenantId,
              )
              .eq('source', 'gmail')
              .not(
                'source_id',
                'in',
                `(${currentIds.join(',')})`,
              );

            if (deleteError) {
              console.error(
                '[Sync Worker] Error deleting removed Gmail messages:',
                deleteError,
              );
            }
          }
        }
      }

      /*
       * Documents
       */
      if (
        canonicalData.documents.length > 0
      ) {
        const documentsToInsert =
          canonicalData.documents.map(
            (document) => ({
              ...document,
              tenant_id: tenantId,
            }),
          );

        const { error: documentsError } =
          await supabaseServer
            .from('documents')
            .upsert(documentsToInsert, {
              onConflict:
                'tenant_id,source,source_id',
            });

        if (documentsError) {
          console.error(
            '[Sync Worker] Error inserting documents:',
            documentsError,
          );
        } else {
          itemsSynced +=
            canonicalData.documents.length;
        }
      }

      /*
       * Generate embeddings only after all data
       * has been saved.
       */
      console.log(
        `[Sync Worker] Generating embeddings for tenant ${tenantId}`,
      );

      const embeddingResult =
        await indexTenantEmbeddings(
          supabaseServer,
          {
            tenantId,
            batchSize: 100,
          },
        );

      console.log(
        '[Sync Worker] Embedding generation completed:',
        {
          fetched:
            embeddingResult.totals.fetched,
          processed:
            embeddingResult.totals
              .processed,
          skipped:
            embeddingResult.totals.skipped,
          failed:
            embeddingResult.totals.failed,
        },
      );

      /*
       * Mark sync as completed
       */
      const {
        error: completionError,
      } = await supabaseServer
        .from('sync_jobs')
        .update({
          status: 'completed',
          completed_at:
            new Date().toISOString(),
          items_synced: itemsSynced,
        })
        .eq('id', syncJob.id);

      if (completionError) {
        throw new Error(
          completionError.message,
        );
      }

      // Auto-generate embeddings in background for semantic search
      try {
        await generateEmbeddingsForRecord({ userId, tenantId, connector });
      } catch (embErr) {
        console.warn('[Sync Worker] Background embedding generation skipped:', embErr);
      }

      return { success: true, itemsSynced };
    } catch (error) {
      console.error(
        `[Sync Worker] Error during ${connector} sync:`,
        error,
      );

      /*
       * Mark sync as failed
       */
      await supabaseServer
        .from('sync_jobs')
        .update({
          status: 'failed',
          completed_at:
            new Date().toISOString(),
          error_message:
            error instanceof Error
              ? error.message
              : 'Unknown sync error',
        })
        .eq('id', syncJob.id);

      throw error;
    }
  },
  {
    connection:
      connection as unknown as ConnectionOptions,
    concurrency: 5,
  },
);

// Worker event handlers
syncWorker.on('completed', (job) => {
  console.log(
    `[Sync Worker] Job ${job.id} completed successfully`,
  );
});

syncWorker.on(
  'failed',
  (job, error) => {
    console.error(
      `[Sync Worker] Job ${job?.id} failed:`,
      error.message,
    );
  },
);

syncWorker.on('error', (error) => {
  console.error(
    '[Sync Worker] Worker error:',
    error,
  );
});

console.log(
  '[Sync Worker] Started and ready to process sync jobs',
);
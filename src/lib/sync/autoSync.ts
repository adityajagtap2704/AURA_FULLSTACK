import { GoogleConnector } from '@/lib/connectors/google';
import { NotionConnector } from '@/lib/connectors/notion';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * Triggers background synchronization for connected providers if a sync hasn't run recently.
 * This runs completely asynchronously and does not block the caller API response.
 *
 * @param userId - The user ID to sync for
 * @param tenantId - The tenant ID (currently equal to userId)
 */
export async function triggerBackgroundSync(userId: string, tenantId: string): Promise<void> {
  // Execute in background using setTimeout/IIFE to make sure it doesn't block the caller thread
  (async () => {
    try {
      // 1. Check Google Connector Status
      const { data: googleToken } = await supabaseServer
        .from('oauth_tokens')
        .select('created_at')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .limit(1);

      if (googleToken && googleToken.length > 0) {
        // Query the most recent sync job for Google
        const { data: recentJobs } = await supabaseServer
          .from('sync_jobs')
          .select('started_at, status')
          .eq('tenant_id', tenantId)
          .eq('connector', 'google')
          .order('created_at', { ascending: false })
          .limit(1);

        // Auto-sync if no job exists, last job failed/completed > 60 seconds ago,
        // or a running job got stuck (> 5 minutes ago)
        const startedAt = recentJobs?.[0]?.started_at;
        const needsSync =
          !recentJobs ||
          recentJobs.length === 0 ||
          recentJobs[0].status === 'failed' ||
          !startedAt ||
          (Date.now() - new Date(startedAt).getTime() > 60000);

        if (needsSync) {
          console.log(`[AutoSync] Triggering background Google sync for tenant ${tenantId}`);
          const googleConnector = new GoogleConnector();
          await googleConnector.sync(userId, tenantId);
        }
      }

      // 2. Check Notion Connector Status
      const { data: notionToken } = await supabaseServer
        .from('oauth_tokens')
        .select('created_at')
        .eq('user_id', userId)
        .eq('provider', 'notion')
        .limit(1);

      if (notionToken && notionToken.length > 0) {
        // Query the most recent sync job for Notion
        const { data: recentJobs } = await supabaseServer
          .from('sync_jobs')
          .select('started_at, status')
          .eq('tenant_id', tenantId)
          .eq('connector', 'notion')
          .order('created_at', { ascending: false })
          .limit(1);

        const startedAt = recentJobs?.[0]?.started_at;
        const needsSync =
          !recentJobs ||
          recentJobs.length === 0 ||
          recentJobs[0].status === 'failed' ||
          !startedAt ||
          (Date.now() - new Date(startedAt).getTime() > 60000);

        if (needsSync) {
          console.log(`[AutoSync] Triggering background Notion sync for tenant ${tenantId}`);
          const notionConnector = new NotionConnector();
          await notionConnector.sync(userId, tenantId);
        }
      }
    } catch (err) {
      console.error('[AutoSync] Error during background sync trigger:', err);
    }
  })();
}

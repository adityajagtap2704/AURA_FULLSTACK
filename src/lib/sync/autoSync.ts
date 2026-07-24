import { GoogleConnector } from '@/lib/connectors/google';
import { NotionConnector } from '@/lib/connectors/notion';
import { indexTenantEmbeddings } from '@/lib/embeddings/index-tenant';
import { supabaseServer } from '@/lib/supabase/server';

/**
 * Triggers background synchronization for connected providers
 * when a recent sync has not already run.
 *
 * Phase 1:
 * tenantId should be the same as userId.
 *
 * @param userId - Authenticated user ID
 * @param tenantId - Tenant ID, currently equal to userId
 */
export async function triggerBackgroundSync(
  userId: string,
  tenantId: string,
): Promise<void> {
  void (async () => {
    try {
      let syncCompleted = false;

      /*
       * Google sync
       */
      const { data: googleToken, error: googleTokenError } =
        await supabaseServer
          .from('oauth_tokens')
          .select('created_at')
          .eq('user_id', userId)
          .eq('provider', 'google')
          .limit(1);

      if (googleTokenError) {
        console.error(
          '[AutoSync] Failed to check Google connection:',
          googleTokenError,
        );
      } else if (googleToken && googleToken.length > 0) {
        const { data: recentJobs, error: googleJobsError } =
          await supabaseServer
            .from('sync_jobs')
            .select('started_at, status')
            .eq('tenant_id', tenantId)
            .eq('connector', 'google')
            .order('created_at', { ascending: false })
            .limit(1);

        if (googleJobsError) {
          console.error(
            '[AutoSync] Failed to check recent Google sync jobs:',
            googleJobsError,
          );
        } else {
          const latestJob = recentJobs?.[0];
          const startedAt = latestJob?.started_at;

          const needsSync =
            !latestJob ||
            latestJob.status === 'failed' ||
            !startedAt ||
            Date.now() - new Date(startedAt).getTime() > 60_000;

          if (needsSync) {
            console.log(
              `[AutoSync] Triggering Google sync for tenant ${tenantId}`,
            );

            try {
              const googleConnector = new GoogleConnector();

              await googleConnector.sync(userId, tenantId);

              syncCompleted = true;

              console.log(
                `[AutoSync] Google sync completed for tenant ${tenantId}`,
              );
            } catch (error) {
              console.error(
                `[AutoSync] Google sync failed for tenant ${tenantId}:`,
                error,
              );
            }
          }
        }
      }

      /*
       * Notion sync
       */
      const { data: notionToken, error: notionTokenError } =
        await supabaseServer
          .from('oauth_tokens')
          .select('created_at')
          .eq('user_id', userId)
          .eq('provider', 'notion')
          .limit(1);

      if (notionTokenError) {
        console.error(
          '[AutoSync] Failed to check Notion connection:',
          notionTokenError,
        );
      } else if (notionToken && notionToken.length > 0) {
        const { data: recentJobs, error: notionJobsError } =
          await supabaseServer
            .from('sync_jobs')
            .select('started_at, status')
            .eq('tenant_id', tenantId)
            .eq('connector', 'notion')
            .order('created_at', { ascending: false })
            .limit(1);

        if (notionJobsError) {
          console.error(
            '[AutoSync] Failed to check recent Notion sync jobs:',
            notionJobsError,
          );
        } else {
          const latestJob = recentJobs?.[0];
          const startedAt = latestJob?.started_at;

          const needsSync =
            !latestJob ||
            latestJob.status === 'failed' ||
            !startedAt ||
            Date.now() - new Date(startedAt).getTime() > 60_000;

          if (needsSync) {
            console.log(
              `[AutoSync] Triggering Notion sync for tenant ${tenantId}`,
            );

            try {
              const notionConnector = new NotionConnector();

              await notionConnector.sync(userId, tenantId);

              syncCompleted = true;

              console.log(
                `[AutoSync] Notion sync completed for tenant ${tenantId}`,
              );
            } catch (error) {
              console.error(
                `[AutoSync] Notion sync failed for tenant ${tenantId}:`,
                error,
              );
            }
          }
        }
      }

      /*
       * Generate embeddings once after one or more successful syncs.
       */
      if (syncCompleted) {
        console.log(
          `[AutoSync] Generating embeddings for tenant ${tenantId}`,
        );

        try {
          const embeddingResult = await indexTenantEmbeddings(
            supabaseServer,
            {
              tenantId,
              batchSize: 100,
            },
          );

          console.log(
            `[AutoSync] Embedding generation completed for tenant ${tenantId}`,
            embeddingResult.totals,
          );
        } catch (error) {
          console.error(
            `[AutoSync] Embedding generation failed for tenant ${tenantId}:`,
            error,
          );
        }
      }
    } catch (error) {
      console.error(
        '[AutoSync] Unexpected error during background sync:',
        error,
      );
    }
  })();
}
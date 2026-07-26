import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
  runEmbeddingPipeline,
  type EmbeddingObjectType,
  type EmbeddingPipelineResult,
} from "@/lib/embeddings/pipeline";

interface IndexTenantEmbeddingsOptions {
  tenantId: string;
  batchSize?: number;
  force?: boolean;
}

interface IndexTenantEmbeddingsResult {
  tenantId: string;
  batchSize: number;
  totals: {
    fetched: number;
    processed: number;
    skipped: number;
    failed: number;
  };
  results: Record<
    EmbeddingObjectType,
    EmbeddingPipelineResult
  >;
}

const OBJECT_TYPES: EmbeddingObjectType[] = [
  "tasks",
  "events",
  "messages",
  "documents",
];

export async function indexTenantEmbeddings(
  supabase: SupabaseClient<Database>,
  options: IndexTenantEmbeddingsOptions,
): Promise<IndexTenantEmbeddingsResult> {
  const tenantId = options.tenantId.trim();

  if (!tenantId) {
    throw new Error("tenantId is required.");
  }

  const batchSize =
    typeof options.batchSize === "number" &&
    Number.isFinite(options.batchSize) &&
    options.batchSize > 0
      ? Math.floor(options.batchSize)
      : 100;

  const force = options.force ?? false;

  const results = {} as Record<
    EmbeddingObjectType,
    EmbeddingPipelineResult
  >;

  let totalFetched = 0;
  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const objectType of OBJECT_TYPES) {
    const result = await runEmbeddingPipeline(
      supabase,
      {
        tenantId,
        objectType,
        limit: batchSize,
        force,
      },
    );

    results[objectType] = result;

    totalFetched += result.fetched;
    totalProcessed += result.processed;
    totalSkipped += result.skipped;
    totalFailed += result.failed;
  }

  return {
    tenantId,
    batchSize,
    totals: {
      fetched: totalFetched,
      processed: totalProcessed,
      skipped: totalSkipped,
      failed: totalFailed,
    },
    results,
  };
}
import type { SupabaseClient } from "@supabase/supabase-js";

import { embedQuery } from "./model";

import {
  EMBEDDING_MODEL,
  type ObjectType,
  type SearchMatch,
  type SearchOptions,
  type SearchResult,
} from "./type";

const TABLE_BY_OBJECT_TYPE: Record<ObjectType, string> = {
  task: "tasks",
  event: "events",
  message: "messages",
  document: "documents",
};

function validateSearchOptions(options: SearchOptions): void {
  if (!options.tenantId.trim()) {
    throw new Error("tenantId is required.");
  }

  if (!options.query.trim()) {
    throw new Error("Search query is required.");
  }

  if (
    options.limit !== undefined &&
    (options.limit < 1 || options.limit > 50)
  ) {
    throw new Error("Search limit must be between 1 and 50.");
  }

  if (
    options.threshold !== undefined &&
    (options.threshold < -1 || options.threshold > 1)
  ) {
    throw new Error(
      "Similarity threshold must be between -1 and 1.",
    );
  }
}

async function fetchCanonicalRecord(
  supabase: SupabaseClient,
  match: SearchMatch,
): Promise<Record<string, unknown> | null> {
  const table = TABLE_BY_OBJECT_TYPE[match.object_type];

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", match.object_id)
    .eq("tenant_id", match.tenant_id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch canonical search result", {
      table,
      objectId: match.object_id,
      error: error.message,
    });

    return null;
  }

  return data as Record<string, unknown> | null;
}

export async function semanticSearch(
  supabase: SupabaseClient,
  options: SearchOptions,
): Promise<SearchResult[]> {
  validateSearchOptions(options);

  const queryEmbedding = await embedQuery(options.query);

  const limit = options.limit ?? 10;

  /*
   * Start with no aggressive threshold.
   * BGE scores must be calibrated against real AURA data.
   */
  const threshold = options.threshold ?? 0;

  try {
    const { data, error } = await supabase.rpc(
      "match_embeddings",
      {
        query_embedding: queryEmbedding,
        match_tenant_id: options.tenantId,
        match_embedding_model: EMBEDDING_MODEL,
        match_threshold: threshold,
        match_count: limit,
        match_object_types:
          options.objectTypes?.length
            ? options.objectTypes
            : null,
      },
    );

    if (!error && data && data.length > 0) {
      const matches = (data ?? []) as SearchMatch[];
      return await Promise.all(
        matches.map(async (match): Promise<SearchResult> => {
          const record = await fetchCanonicalRecord(
            supabase,
            match,
          );

          return {
            ...match,
            similarity: Number(match.similarity),
            record,
          };
        }),
      );
    }
  } catch (err) {
    console.warn('[SemanticSearch] RPC fallback to multi-table search due to:', err);
  }

  // Graceful text-match fallback across events, tasks, and messages
  const queryLower = options.query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search events (meetings)
  const { data: matchedEvents } = await supabase
    .from('events')
    .select('*')
    .eq('tenant_id', options.tenantId)
    .ilike('title', `%${queryLower}%`)
    .limit(limit);

  for (const e of matchedEvents || []) {
    results.push({
      id: `text-match-${e.id}`,
      object_type: 'event',
      object_id: e.id,
      tenant_id: options.tenantId,
      embedding_model: EMBEDDING_MODEL,
      content: `Meeting: ${e.title}`,
      similarity: 0.88,
      record: e,
    });
  }

  // Search tasks
  const { data: matchedTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('tenant_id', options.tenantId)
    .ilike('title', `%${queryLower}%`)
    .limit(limit);

  for (const t of matchedTasks || []) {
    results.push({
      id: `text-match-${t.id}`,
      object_type: 'task',
      object_id: t.id,
      tenant_id: options.tenantId,
      embedding_model: EMBEDDING_MODEL,
      content: `Task: ${t.title}`,
      similarity: 0.85,
      record: t,
    });
  }

  // Search messages (emails)
  const { data: matchedMsgs } = await supabase
    .from('messages')
    .select('*')
    .eq('tenant_id', options.tenantId)
    .or(`subject.ilike.%${queryLower}%,snippet.ilike.%${queryLower}%`)
    .limit(limit);

  for (const m of matchedMsgs || []) {
    results.push({
      id: `text-match-${m.id}`,
      object_type: 'message',
      object_id: m.id,
      tenant_id: options.tenantId,
      embedding_model: EMBEDDING_MODEL,
      content: `Email: ${m.subject || m.snippet}`,
      similarity: 0.82,
      record: m,
    });
  }

  return results.slice(0, limit);
}
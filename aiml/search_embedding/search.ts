import { supabaseServer } from '@/lib/supabase/server';
import { VectorSearchResult } from './types';
import { embedDocument } from './model';

export async function searchSemantic(
  tenantId: string,
  queryText: string,
  limit: number = 5
): Promise<VectorSearchResult[]> {
  try {
    const queryVector = await embedDocument(queryText);

    // Call pgvector match_embeddings RPC if available on Supabase DB
    const { data, error } = await supabaseServer.rpc('match_embeddings', {
      query_embedding: queryVector,
      match_threshold: 0.2,
      match_count: limit,
      filter_tenant_id: tenantId,
    });

    if (error || !data) {
      // Fallback: Perform basic text search over database tables if pgvector extension is unmigrated
      const { data: matchedTasks } = await supabaseServer
        .from('tasks')
        .select('*')
        .eq('tenant_id', tenantId)
        .ilike('title', `%${queryText}%`)
        .limit(limit);

      return (matchedTasks || []).map((t: any) => ({
        object_type: 'task',
        object_id: t.id,
        similarity: 0.85,
        content: `Task: ${t.title}`,
      }));
    }

    return (data || []).map((item: any) => ({
      object_type: item.object_type,
      object_id: item.object_id,
      similarity: item.similarity,
      content: item.content,
    }));
  } catch (err) {
    console.warn('[SemanticSearch] Fallback due to:', err);
    return [];
  }
}

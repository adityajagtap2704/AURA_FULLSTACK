import { supabaseServer } from '@/lib/supabase/server';
import { generateEmbeddingRow } from './generator';
import { ObjectType } from './types';

export async function generateEmbeddingsForRecord(data: {
  userId: string;
  tenantId: string;
  connector: string;
}): Promise<void> {
  const { tenantId } = data;
  try {
    // 1. Process tasks
    const { data: tasks } = await supabaseServer
      .from('tasks')
      .select('*')
      .eq('tenant_id', tenantId);

    for (const task of tasks || []) {
      const row = await generateEmbeddingRow('task', task);
      if (row) {
        await supabaseServer.from('embeddings').upsert(row as any, {
          onConflict: 'object_type,object_id',
        });
      }
    }

    // 2. Process events
    const { data: events } = await supabaseServer
      .from('events')
      .select('*')
      .eq('tenant_id', tenantId);

    for (const event of events || []) {
      const row = await generateEmbeddingRow('event', event);
      if (row) {
        await supabaseServer.from('embeddings').upsert(row as any, {
          onConflict: 'object_type,object_id',
        });
      }
    }
  } catch (err) {
    console.warn('[EmbeddingPipeline] Background indexing skipped/failed:', err);
  }
}

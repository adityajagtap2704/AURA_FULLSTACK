export const EMBEDDING_MODEL = 'BAAI/bge-small-en-v1.5';

export type ObjectType = 'task' | 'event' | 'message' | 'document';

export interface TaskRecord {
  id: string;
  tenant_id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
}

export interface EventRecord {
  id: string;
  tenant_id: string;
  title: string;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
}

export interface MessageRecord {
  id: string;
  tenant_id: string;
  subject?: string | null;
  sender?: string | null;
  body?: string | null;
  snippet?: string | null;
}

export interface DocumentRecord {
  id: string;
  tenant_id: string;
  title: string;
  content?: string | null;
}

export type CanonicalRecord = TaskRecord | EventRecord | MessageRecord | DocumentRecord;

export interface EmbeddingInput {
  object_type: ObjectType;
  object_id: string;
  tenant_id: string;
  content: string;
}

export interface EmbeddingRow extends EmbeddingInput {
  embedding: number[];
  model: string;
  updated_at?: string;
}

export interface VectorSearchResult {
  object_type: ObjectType;
  object_id: string;
  similarity: number;
  content: string;
}

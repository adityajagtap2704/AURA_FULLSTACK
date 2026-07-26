export const EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5";
export const EMBEDDING_DIMENSION = 768;

export type ObjectType = "task" | "event" | "message" | "document";

export interface BaseCanonicalRecord {
  id: string;
  tenant_id: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TaskRecord extends BaseCanonicalRecord {
  title?: string | null;
  description?: string | null;
  status?: string | null;
  due_date?: string | null;
  priority?: string | null;
  source?: string | null;
  source_id?: string | null;
}

export interface EventRecord extends BaseCanonicalRecord {
  title?: string | null;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  attendees?: unknown;
  source?: string | null;
  source_id?: string | null;
}

export interface MessageRecord extends BaseCanonicalRecord {
  sender?: string | null;
  recipients?: unknown;
  subject?: string | null;
  snippet?: string | null;
  body?: string | null;
  flagged?: boolean | null;
  received_at?: string | null;
  source?: string | null;
  source_id?: string | null;
}

export interface DocumentRecord extends BaseCanonicalRecord {
  title?: string | null;
  content?: string | null;
  description?: string | null;
  url?: string | null;
  last_modified?: string | null;
  source?: string | null;
  source_id?: string | null;
}

export type CanonicalRecord =
  | TaskRecord
  | EventRecord
  | MessageRecord
  | DocumentRecord;

export interface EmbeddingInput {
  tenantId: string;
  objectType: ObjectType;
  objectId: string;
  content: string;
}

export interface EmbeddingRow {
  tenant_id: string;
  object_type: ObjectType;
  object_id: string;
  content: string;
  embedding: number[];
  embedding_model: string;
  updated_at: string;
}

export interface SearchOptions {
  tenantId: string;
  query: string;
  limit?: number;
  threshold?: number;
  objectTypes?: ObjectType[];
}

export interface SearchMatch {
  id: string;
  tenant_id: string;
  object_type: ObjectType;
  object_id: string;
  content: string;
  embedding_model: string;
  similarity: number;
}

export interface SearchResult extends SearchMatch {
  record: Record<string, unknown> | null;
}

export interface PipelineOptions {
  tenantId: string;
  objectTypes?: ObjectType[];
  batchSize?: number;
}

export interface PipelineObjectResult {
  objectType: ObjectType;
  processed: number;
  skipped: number;
  failed: number;
}

export interface PipelineResult {
  tenantId: string;
  processed: number;
  skipped: number;
  failed: number;
  results: PipelineObjectResult[];
}
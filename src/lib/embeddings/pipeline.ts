import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { generateEmbeddingRow } from "@/lib/embeddings/generate";
import { EMBEDDING_MODEL } from "@/lib/embeddings/model";

export type EmbeddingObjectType =
  | "tasks"
  | "events"
  | "messages"
  | "documents";

export interface EmbeddingPipelineOptions {
  tenantId: string;
  objectType: EmbeddingObjectType;
  limit?: number;

  /**
   * When false, records that already have an embedding for the current
   * embedding model will be skipped.
   *
   * Default: false
   */
  force?: boolean;
}

export interface EmbeddingPipelineResult {
  tenantId: string;
  objectType: EmbeddingObjectType;
  embeddingModel: string;
  fetched: number;
  processed: number;
  skipped: number;
  failed: number;
  errors: Array<{
    objectId: string;
    message: string;
  }>;
}

type SourceRecord = Record<string, unknown>;

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

const embeddingObjectTypeMap = {
  tasks: "task",
  events: "event",
  messages: "message",
  documents: "document",
} as const;

/**
 * Converts a database value into searchable text.
 */
function valueToText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.trim();
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map(valueToText)
      .filter(Boolean)
      .join(" ");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  return "";
}

/**
 * Returns the first available non-empty value from a list of possible columns.
 */
function getFirstText(
  record: SourceRecord,
  fields: string[]
): string {
  for (const field of fields) {
    const text = valueToText(record[field]);

    if (text) {
      return text;
    }
  }

  return "";
}

/**
 * Builds searchable content for each supported table.
 *
 * The function supports multiple possible column names so that it can work
 * even when the exact schema differs slightly.
 */
function buildSearchableContent(
  objectType: EmbeddingObjectType,
  record: SourceRecord
): string {
  const parts: string[] = [];

  switch (objectType) {
    case "tasks": {
      const title = getFirstText(record, ["title", "name"]);
      const description = getFirstText(record, [
        "description",
        "content",
        "details",
        "body",
      ]);
      const status = getFirstText(record, ["status"]);
      const priority = getFirstText(record, ["priority"]);
      const dueDate = getFirstText(record, [
        "due_date",
        "due_at",
        "deadline",
      ]);

      if (title) parts.push(`Task title: ${title}`);
      if (description) parts.push(`Description: ${description}`);
      if (status) parts.push(`Status: ${status}`);
      if (priority) parts.push(`Priority: ${priority}`);
      if (dueDate) parts.push(`Due date: ${dueDate}`);

      break;
    }

    case "events": {
      const title = getFirstText(record, ["title", "name"]);
      const description = getFirstText(record, [
        "description",
        "content",
        "details",
      ]);
      const location = getFirstText(record, ["location"]);
      const startTime = getFirstText(record, [
        "starts_at",
        "start_at",
        "start_time",
        "event_date",
      ]);
      const endTime = getFirstText(record, [
        "ends_at",
        "end_at",
        "end_time",
      ]);

      if (title) parts.push(`Event title: ${title}`);
      if (description) parts.push(`Description: ${description}`);
      if (location) parts.push(`Location: ${location}`);
      if (startTime) parts.push(`Start time: ${startTime}`);
      if (endTime) parts.push(`End time: ${endTime}`);

      break;
    }

    case "messages": {
      const subject = getFirstText(record, ["subject", "title"]);
      const message = getFirstText(record, [
        "content",
        "body",
        "message",
        "text",
      ]);
      const sender = getFirstText(record, [
        "sender_name",
        "sender",
        "from_name",
        "author_name",
      ]);
      const channel = getFirstText(record, [
        "channel_name",
        "channel",
        "source",
      ]);

      if (subject) parts.push(`Message subject: ${subject}`);
      if (sender) parts.push(`Sender: ${sender}`);
      if (channel) parts.push(`Channel: ${channel}`);
      if (message) parts.push(`Message: ${message}`);

      break;
    }

    case "documents": {
      const title = getFirstText(record, [
        "title",
        "name",
        "file_name",
        "filename",
      ]);
      const content = getFirstText(record, [
        "content",
        "text",
        "body",
        "extracted_text",
      ]);
      const summary = getFirstText(record, ["summary"]);
      const source = getFirstText(record, [
        "source",
        "source_url",
        "url",
        "provider",
      ]);

      if (title) parts.push(`Document title: ${title}`);
      if (summary) parts.push(`Summary: ${summary}`);
      if (content) parts.push(`Content: ${content}`);
      if (source) parts.push(`Source: ${source}`);

      break;
    }
  }

  /*
   * Fallback:
   * If none of the expected fields exist, collect useful primitive values
   * from the row while excluding IDs and internal metadata.
   */
  if (parts.length === 0) {
    const excludedFields = new Set([
      "id",
      "tenant_id",
      "created_at",
      "updated_at",
      "deleted_at",
      "embedding",
    ]);

    for (const [key, value] of Object.entries(record)) {
      if (excludedFields.has(key)) {
        continue;
      }

      const text = valueToText(value);

      if (text) {
        parts.push(`${key.replaceAll("_", " ")}: ${text}`);
      }
    }
  }

  return parts.join("\n").trim();
}

/**
 * Reads the object ID safely from a source row.
 */
function getObjectId(record: SourceRecord): string | null {
  const id = record.id;

  if (typeof id === "string" && id.trim()) {
    return id;
  }

  if (typeof id === "number") {
    return String(id);
  }

  return null;
}

/**
 * Runs the embedding pipeline for one tenant and one source table.
 */
export async function runEmbeddingPipeline(
  supabase: SupabaseClient<Database>,
  options: EmbeddingPipelineOptions
): Promise<EmbeddingPipelineResult> {
  const tenantId = options.tenantId.trim();
  const objectType = options.objectType;
  const storedObjectType = embeddingObjectTypeMap[objectType];
  const force = options.force ?? false;

  const requestedLimit = options.limit ?? DEFAULT_LIMIT;
  const limit = Math.min(
    Math.max(requestedLimit, 1),
    MAX_LIMIT
  );

  if (!tenantId) {
    throw new Error("tenantId is required.");
  }

  const result: EmbeddingPipelineResult = {
    tenantId,
    objectType,
    embeddingModel: EMBEDDING_MODEL,
    fetched: 0,
    processed: 0,
    skipped: 0,
    failed: 0,
    errors: [],
  };

  /*
   * Fetch source records belonging only to the selected tenant.
   */
  const { data: sourceRows, error: sourceError } = await supabase
    .from(objectType)
    .select("*")
    .eq("tenant_id", tenantId)
    .limit(limit);

  if (sourceError) {
    throw new Error(
      `Failed to fetch ${objectType}: ${sourceError.message}`
    );
  }

  const records = (sourceRows ?? []) as unknown as SourceRecord[];

  result.fetched = records.length;

  if (records.length === 0) {
    return result;
  }

  /*
   * Load existing embeddings so we do not regenerate them unnecessarily.
   */
  const objectIds = records
    .map(getObjectId)
    .filter((id): id is string => Boolean(id));

  const existingObjectIds = new Set<string>();

  if (!force && objectIds.length > 0) {
    const { data: existingRows, error: existingError } = await supabase
      .from("embeddings")
      .select("object_id")
      .eq("tenant_id", tenantId)
      .eq("object_type", storedObjectType)
      .eq("embedding_model", EMBEDDING_MODEL)
      .in("object_id", objectIds);

    if (existingError) {
      throw new Error(
        `Failed to check existing embeddings: ${existingError.message}`
      );
    }

    for (const row of existingRows ?? []) {
      if (row.object_id) {
        existingObjectIds.add(String(row.object_id));
      }
    }
  }

  /*
   * Process records one by one.
   *
   * Sequential processing is safer initially because embedding models and
   * external APIs can have memory or rate limits.
   */
  for (const record of records) {
    const objectId = getObjectId(record);

    if (!objectId) {
      result.failed += 1;
      result.errors.push({
        objectId: "unknown",
        message: "Source record does not contain a valid id.",
      });
      continue;
    }

    if (!force && existingObjectIds.has(objectId)) {
      result.skipped += 1;
      continue;
    }

    try {
      const content = buildSearchableContent(objectType, record);

      if (!content) {
        throw new Error(
          "No searchable text could be created from this record."
        );
      }

      const embeddingRow = await generateEmbeddingRow({
        tenantId,
        objectType: storedObjectType,
        objectId,
        content,
      });

      const { error: upsertError } = await supabase
        .from("embeddings")
        .upsert({
        ...embeddingRow,
        embedding: `[${embeddingRow.embedding.join(",")}]`,
      },
      {
        onConflict:
          "tenant_id,object_type,object_id,embedding_model",
      }
    );

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      result.processed += 1;
    } catch (error) {
      result.failed += 1;

      result.errors.push({
        objectId,
        message:
          error instanceof Error
            ? error.message
            : "Unknown embedding pipeline error.",
      });
    }
  }

  return result;
}
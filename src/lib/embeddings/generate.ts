import {
  EMBEDDING_MODEL,
  type CanonicalRecord,
  type DocumentRecord,
  type EmbeddingInput,
  type EmbeddingRow,
  type EventRecord,
  type MessageRecord,
  type ObjectType,
  type TaskRecord,
} from "./type";

import { embedDocument } from "./model";


function clean(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value.replace(/\s+/g, " ").trim();
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => clean(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  return String(value).trim();
}

function joinFields(
  fields: Array<[label: string, value: unknown]>,
): string {
  return fields
    .map(([label, value]) => {
      const cleanedValue = clean(value);
      return cleanedValue ? `${label}: ${cleanedValue}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

export function buildTaskContent(task: TaskRecord): string {
  return joinFields([
    ["Type", "Task"],
    ["Title", task.title],
    ["Description", task.description],
    ["Status", task.status],
    ["Priority", task.priority],
    ["Due date", task.due_date],
    ["Source", task.source],
  ]);
}

export function buildEventContent(event: EventRecord): string {
  return joinFields([
    ["Type", "Event"],
    ["Title", event.title],
    ["Description", event.description],
    ["Start time", event.start_time],
    ["End time", event.end_time],
    ["Location", event.location],
    ["Attendees", event.attendees],
    ["Source", event.source],
  ]);
}

export function buildMessageContent(message: MessageRecord): string {
  return joinFields([
    ["Type", "Message"],
    ["Sender", message.sender],
    ["Recipients", message.recipients],
    ["Subject", message.subject],
    ["Snippet", message.snippet],
    ["Body", message.body],
    ["Flagged", message.flagged],
    ["Received at", message.received_at],
    ["Source", message.source],
  ]);
}

export function buildDocumentContent(document: DocumentRecord): string {
  return joinFields([
    ["Type", "Document"],
    ["Title", document.title],
    ["Description", document.description],
    ["Content", document.content],
    ["URL", document.url],
    ["Last modified", document.last_modified],
    ["Source", document.source],
  ]);
}

export function buildSearchableContent(
  objectType: ObjectType,
  record: CanonicalRecord,
): string {
  switch (objectType) {
    case "task":
      return buildTaskContent(record as TaskRecord);

    case "event":
      return buildEventContent(record as EventRecord);

    case "message":
      return buildMessageContent(record as MessageRecord);

    case "document":
      return buildDocumentContent(record as DocumentRecord);

    default: {
      const exhaustiveCheck: never = objectType;
      throw new Error(`Unsupported object type: ${exhaustiveCheck}`);
    }
  }
}

export function createEmbeddingInput(
  objectType: ObjectType,
  record: CanonicalRecord,
): EmbeddingInput | null {
  const content = buildSearchableContent(objectType, record).trim();

  if (!content || !record.id || !record.tenant_id) {
    return null;
  }

  return {
    tenantId: record.tenant_id,
    objectType,
    objectId: record.id,
    content,
  };
}

export async function generateEmbeddingRow(
  input: EmbeddingInput,
): Promise<EmbeddingRow> {
  const embedding = await embedDocument(input.content);

  return {
    tenant_id: input.tenantId,
    object_type: input.objectType,
    object_id: input.objectId,
    content: input.content,
    embedding,
    embedding_model: EMBEDDING_MODEL,
    updated_at: new Date().toISOString(),
  };
}

export async function generateQueryEmbedding(
  query: string,
): Promise<number[]> {
  const cleanedQuery = query.trim();

  if (!cleanedQuery) {
    throw new Error("Search query is required");
  }

  return embedDocument(cleanedQuery);
}
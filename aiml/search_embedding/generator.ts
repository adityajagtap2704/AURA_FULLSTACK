import {
  EMBEDDING_MODEL,
  ObjectType,
  TaskRecord,
  EventRecord,
  MessageRecord,
  DocumentRecord,
  EmbeddingRow,
} from './types';
import { embedDocument } from './model';

function clean(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.replace(/\s+/g, ' ').trim();
  if (Array.isArray(value)) return value.map(clean).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }
  return String(value).trim();
}

function joinFields(fields: Array<[label: string, value: unknown]>): string {
  return fields
    .map(([label, value]) => {
      const cleanedValue = clean(value);
      return cleanedValue ? `${label}: ${cleanedValue}` : '';
    })
    .filter(Boolean)
    .join('\n');
}

export function buildTaskContent(task: TaskRecord): string {
  return joinFields([
    ['Type', 'Task'],
    ['Title', task.title],
    ['Description', task.description],
    ['Status', task.status],
    ['Priority', task.priority],
    ['Due Date', task.due_date],
  ]);
}

export function buildEventContent(event: EventRecord): string {
  return joinFields([
    ['Type', 'Event'],
    ['Title', event.title],
    ['Description', event.description],
    ['Start Time', event.start_time],
    ['End Time', event.end_time],
    ['Location', event.location],
  ]);
}

export function buildMessageContent(message: MessageRecord): string {
  return joinFields([
    ['Type', 'Message'],
    ['Subject', message.subject],
    ['Sender', message.sender],
    ['Body', message.body || message.snippet],
  ]);
}

export function buildDocumentContent(doc: DocumentRecord): string {
  return joinFields([
    ['Type', 'Document'],
    ['Title', doc.title],
    ['Content', doc.content],
  ]);
}

export async function generateEmbeddingRow(
  objectType: ObjectType,
  record: any
): Promise<EmbeddingRow | null> {
  let content = '';
  switch (objectType) {
    case 'task':
      content = buildTaskContent(record);
      break;
    case 'event':
      content = buildEventContent(record);
      break;
    case 'message':
      content = buildMessageContent(record);
      break;
    case 'document':
      content = buildDocumentContent(record);
      break;
  }

  if (!content) return null;

  const vector = await embedDocument(content);
  return {
    object_type: objectType,
    object_id: String(record.id),
    tenant_id: String(record.tenant_id),
    content,
    embedding: vector,
    model: EMBEDDING_MODEL,
    updated_at: new Date().toISOString(),
  };
}

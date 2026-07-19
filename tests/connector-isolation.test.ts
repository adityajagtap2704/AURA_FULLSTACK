import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Every connector enqueues sync jobs — stub the queue so tests never try to
// open a real Redis connection.
vi.mock('@/lib/queue', () => ({
  syncQueue: { add: vi.fn().mockResolvedValue(undefined) },
}));

import { GoogleConnector } from '@/lib/connectors/google';
import { NotionConnector } from '@/lib/connectors/notion';
import type { ConnectorInterface } from '@/lib/connectors/base';

const REQUIRED_METHODS: (keyof ConnectorInterface)[] = [
  'authorize',
  'handleCallback',
  'fetch',
  'mapToCanonical',
  'sync',
  'disconnect',
];

describe('connector isolation', () => {
  it('GoogleConnector implements the full ConnectorInterface contract', () => {
    const connector = new GoogleConnector();
    for (const method of REQUIRED_METHODS) {
      expect(typeof connector[method]).toBe('function');
    }
  });

  it('NotionConnector implements the full ConnectorInterface contract', () => {
    const connector = new NotionConnector();
    for (const method of REQUIRED_METHODS) {
      expect(typeof connector[method]).toBe('function');
    }
  });

  it('Google connector source has no import of the Notion connector', () => {
    const googleSource = readFileSync(
      join(__dirname, '../src/lib/connectors/google.ts'),
      'utf-8'
    );
    expect(googleSource).not.toMatch(/(?:import|require)[^\n]*notion/i);
  });

  it('Notion connector source has no import of the Google connector', () => {
    const notionSource = readFileSync(
      join(__dirname, '../src/lib/connectors/notion.ts'),
      'utf-8'
    );
    expect(notionSource).not.toMatch(/(?:import|require)[^\n]*google/i);
  });

  it('GoogleConnector.mapToCanonical produces well-formed canonical Events/Messages with a valid source', async () => {
    const connector = new GoogleConnector();
    const raw = {
      calendarEvents: [
        {
          id: 'evt_1',
          summary: 'Standup',
          start: { dateTime: '2026-07-15T09:00:00Z' },
          end: { dateTime: '2026-07-15T09:15:00Z' },
          attendees: [{ email: 'a@example.com', displayName: 'A', responseStatus: 'accepted' }],
        },
      ],
      gmailMessages: [
        {
          id: 'msg_1',
          snippet: 'hello',
          labelIds: ['STARRED'],
          payload: { headers: [{ name: 'From', value: 'b@example.com' }, { name: 'Subject', value: 'Hi' }] },
        },
      ],
    };

    const canonical = await connector.mapToCanonical(raw, 'tenant-1');

    expect(canonical.events).toHaveLength(1);
    expect(canonical.events[0]).toMatchObject({ source: 'google_calendar', source_id: 'evt_1', title: 'Standup' });
    expect(canonical.messages).toHaveLength(1);
    expect(canonical.messages[0]).toMatchObject({ source: 'gmail', source_id: 'msg_1', flagged: true });
    expect(canonical.tasks).toEqual([]);
    expect(canonical.documents).toEqual([]);
  });

  it('NotionConnector.mapToCanonical produces well-formed canonical Tasks/Documents with a valid source', async () => {
    const connector = new NotionConnector();
    // Shaped like real Notion API responses (every property carries a
    // `type` discriminator) — mapToCanonical matches by type, not by
    // property name, so "Name"/"Status"/"Due Date" here are arbitrary
    // labels the workspace owner chose, not names the code looks for.
    const raw = {
      databaseItems: [
        {
          id: 'page_1',
          properties: {
            Name: { type: 'title', title: [{ plain_text: 'Ship AURA' }] },
            Status: { type: 'status', status: { name: 'In Progress' } },
            'Due Date': { type: 'date', date: { start: '2026-07-20' } },
          },
        },
      ],
      pages: [
        {
          id: 'page_2',
          url: 'https://notion.so/page_2',
          last_edited_time: '2026-07-14T00:00:00Z',
          properties: { Name: { type: 'title', title: [{ plain_text: 'Notes' }] } },
        },
      ],
    };

    const canonical = await connector.mapToCanonical(raw, 'tenant-1');

    expect(canonical.tasks).toHaveLength(1);
    expect(canonical.tasks[0]).toMatchObject({ source: 'notion', source_id: 'page_1', title: 'Ship AURA', status: 'In Progress', due_date: '2026-07-20' });
    expect(canonical.documents).toHaveLength(1);
    expect(canonical.documents[0]).toMatchObject({ source: 'notion', source_id: 'page_2', title: 'Notes' });
    expect(canonical.events).toEqual([]);
    expect(canonical.messages).toEqual([]);
  });

  it('NotionConnector.mapToCanonical finds title/status/date by type regardless of property name', async () => {
    const connector = new NotionConnector();
    // A workspace with entirely different property names/casing than the
    // fixture above — this is the exact bug this test guards against.
    const raw = {
      databaseItems: [
        {
          id: 'page_3',
          properties: {
            Task: { type: 'title', title: [{ plain_text: 'Renew passport' }] },
            Stage: { type: 'select', select: { name: 'Blocked' } },
            date: { type: 'date', date: { start: '2026-07-19' } },
          },
        },
      ],
      pages: [],
    };

    const canonical = await connector.mapToCanonical(raw, 'tenant-1');

    expect(canonical.tasks[0]).toMatchObject({
      title: 'Renew passport',
      status: 'Blocked',
      due_date: '2026-07-19',
    });
  });
});

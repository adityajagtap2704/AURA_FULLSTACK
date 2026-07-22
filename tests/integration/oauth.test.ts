import { describe, it, expect, vi, beforeEach } from 'vitest';

// Fakes the persistence layer for oauth_tokens so this test exercises the
// real OAuth -> ingest -> canonical round trip without a live Supabase/Google.
const { supabaseState, upsertMock, updateMock } = vi.hoisted(() => ({
  supabaseState: { tokenRow: null as Record<string, unknown> | null },
  upsertMock: vi.fn(async (row: Record<string, unknown>) => ({ error: null, row })),
  updateMock: vi.fn(async (patch: Record<string, unknown>) => ({ error: null, patch })),
}));

vi.mock('@/lib/supabase/server', () => {
  const oauthTokensBuilder = {
    select: vi.fn(function (this: unknown) { return this; }),
    eq: vi.fn(function (this: unknown) { return this; }),
    order: vi.fn(function (this: unknown) { return this; }),
    limit: vi.fn(async () => ({
      data: supabaseState.tokenRow ? [supabaseState.tokenRow] : [],
      error: null,
    })),
    upsert: vi.fn(async (row: Record<string, unknown>) => {
      supabaseState.tokenRow = {
        ...row,
        id: 'token-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return upsertMock(row);
    }),
    update: vi.fn((patch: Record<string, unknown>) => {
      updateMock(patch);
      return oauthTokensBuilder;
    }),
  };

  return { supabaseServer: { from: vi.fn(() => oauthTokensBuilder) } };
});

vi.mock('@/lib/queue', () => ({
  syncQueue: { add: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock('googleapis', () => {
  const oauth2ClientInstance = {
    generateAuthUrl: vi.fn(({ state }: { state: string }) =>
      `https://accounts.google.com/o/oauth2/auth?state=${state}`
    ),
    getToken: vi.fn(async (code: string) => ({
      tokens: {
        access_token: 'access-123',
        refresh_token: 'refresh-123',
        expiry_date: Date.now() + 3600_000,
      },
    })),
    setCredentials: vi.fn(),
    on: vi.fn(),
  };

  return {
    google: {
      // Must be a real function (not an arrow fn) so `new google.auth.OAuth2()`
      // works — arrow functions can't be used as constructors.
      auth: { OAuth2: vi.fn(function () { return oauth2ClientInstance; }) },
      calendar: vi.fn(() => ({
        events: {
          list: vi.fn(async () => ({
            data: {
              items: [
                {
                  id: 'evt_1',
                  summary: 'Sprint Planning',
                  start: { dateTime: '2026-07-16T10:00:00Z' },
                  end: { dateTime: '2026-07-16T11:00:00Z' },
                  attendees: [],
                },
              ],
            },
          })),
        },
      })),
      gmail: vi.fn(() => ({
        users: {
          messages: {
            list: vi.fn(async ({ q }: { q: string }) =>
              q === 'is:starred'
                ? { data: { messages: [{ id: 'msg_1' }] } }
                : { data: { messages: [] } }
            ),
            get: vi.fn(async ({ id }: { id: string }) => ({
              data: {
                id,
                snippet: 'Please review the PR',
                labelIds: ['STARRED'],
                payload: {
                  headers: [
                    { name: 'From', value: 'teammate@kalnet.dev' },
                    { name: 'Subject', value: 'Review needed' },
                  ],
                },
              },
            })),
          },
        },
      })),
    },
  };
});

import { GoogleConnector } from '@/lib/connectors/google';

describe('Google OAuth -> ingest -> canonical round trip', () => {
  const userId = 'user-abc';

  beforeEach(() => {
    supabaseState.tokenRow = null;
    upsertMock.mockClear();
    updateMock.mockClear();
  });

  it('authorize() returns a real Google consent URL carrying state', async () => {
    const connector = new GoogleConnector();
    const { authUrl } = await connector.authorize(userId);

    expect(authUrl).toContain('accounts.google.com');
    expect(authUrl).toContain(`state=${userId}`);
  });

  it('handleCallback() exchanges the code and persists tokens', async () => {
    const connector = new GoogleConnector();
    await connector.handleCallback('auth-code-xyz', userId);

    expect(upsertMock).toHaveBeenCalledTimes(1);
    expect(upsertMock.mock.calls[0][0]).toMatchObject({
      user_id: userId,
      provider: 'google',
      access_token: 'access-123',
      refresh_token: 'refresh-123',
    });
  });

  it('fetch() + mapToCanonical() turns the stored token into canonical Events/Messages', async () => {
    const connector = new GoogleConnector();
    await connector.handleCallback('auth-code-xyz', userId);

    const raw = await connector.fetch(userId);
    const canonical = await connector.mapToCanonical(raw, userId);

    expect(canonical.events).toHaveLength(1);
    expect(canonical.events[0]).toMatchObject({ source: 'google_calendar', source_id: 'evt_1' });

    expect(canonical.messages).toHaveLength(1);
    expect(canonical.messages[0]).toMatchObject({ source: 'gmail', source_id: 'msg_1', flagged: true });
  });

  it('fetch() fails loudly (not silently) when no tokens are stored yet', async () => {
    const connector = new GoogleConnector();
    await expect(connector.fetch('never-connected-user')).rejects.toThrow(/No Google OAuth tokens/);
  });
});

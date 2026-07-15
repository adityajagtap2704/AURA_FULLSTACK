# Connector SDK

How to add a new integration (Slack, Linear, Microsoft 365, …) to AURA
without touching any existing connector's code. This is the architectural
guarantee the whole sync pipeline is built around — see
[`src/lib/connectors/base.ts`](../src/lib/connectors/base.ts) for the
contract every connector must satisfy.

## 1. Implement `ConnectorInterface`

Create `src/lib/connectors/<name>.ts`:

```typescript
import { ConnectorInterface, CanonicalData, SyncResult } from './base';
import { syncQueue } from '@/lib/queue';

export class SlackConnector implements ConnectorInterface {
  async authorize(userId: string): Promise<{ authUrl: string }> {
    // Build the provider's OAuth consent URL. Pass a *signed* state, not a
    // raw userId — see src/lib/auth/oauthState.ts and how
    // src/app/api/connectors/google/authorize/route.ts uses it.
  }

  async handleCallback(code: string, userId: string): Promise<void> {
    // Exchange code for tokens, upsert into oauth_tokens keyed by
    // (user_id, provider).
  }

  async fetch(userId: string): Promise<unknown> {
    // Look up stored tokens, call the provider's API, return raw data.
  }

  async mapToCanonical(rawData: unknown, tenantId: string): Promise<CanonicalData> {
    // Transform raw data into { tasks, events, messages, documents }.
    // Every item MUST set `source` (e.g. 'slack') and `source_id`
    // (the provider's native ID) — the (tenant_id, source, source_id)
    // unique constraint is what makes sync idempotent.
  }

  async sync(userId: string, tenantId: string): Promise<SyncResult> {
    // Enqueue, don't run inline — see google.ts / notion.ts for the pattern.
    await syncQueue.add('slack-sync', { userId, tenantId, connector: 'slack' });
    return { success: true, itemsSynced: 0 };
  }

  async disconnect(userId: string): Promise<void> {
    // Delete the user's oauth_tokens row for this provider.
  }

  async healthCheck(userId: string) {
    // Optional but recommended — used by the sync health widget.
  }
}
```

## 2. Register it in the worker

Add one case to the switch statement in
[`src/lib/queue/worker.ts`](../src/lib/queue/worker.ts):

```typescript
case 'slack':
  connectorInstance = new SlackConnector();
  break;
```

That's the only existing file you edit. Google's and Notion's cases are
untouched — verified by `tests/connector-isolation.test.ts`.

## 3. Wire the API routes

Add `src/app/api/connectors/slack/authorize/route.ts`,
`.../callback/route.ts`, and `.../sync/route.ts`, following the Google
connector's routes as the template. All three must call
`getAuthContext(request)` (`src/lib/auth/getAuthContext.ts`) to resolve the
authenticated user — never hardcode a demo ID in a new route.

`POST /api/connectors/[provider]/disconnect` already routes to any
connector by name — add your connector to the `provider === '...'` chain
there, no new route file needed.

## 4. Extend `sync/status` and `sync/trigger`

These already read from `sync_jobs.connector` generically — no changes
needed as long as your worker case writes `connector: 'slack'` (Section 5.4
of the build plan expects the exact connector name to appear there).

## 5. Canonical field rules

- `source` should be a stable lowercase-with-underscore identifier
  (`google_calendar`, `gmail`, `notion`, `slack`) consistent with the rest
  of the schema (`supabase/migrations/001_initial_schema.sql`).
- Never store a raw third-party ID without going through `source_id` — the
  dedup/upsert logic in the worker depends on
  `UNIQUE(tenant_id, source, source_id)`.
- Don't touch `GoogleConnector` or `NotionConnector` to add a new
  connector. If a PR diff touches those files for an unrelated connector,
  that's a signal something's wrong with the abstraction — flag it in
  review (Section 8, Definition of Done).

# Demo → Production Switch

Exactly what changes to move AURA from the demo environment to a real
user's OAuth screen. Per Section 3.1 of the build plan, this must be a
**config change only** — no code rewrite.

## What "demo mode" currently means

- `AURA_DEMO_MODE=true` lets any API request with no `Authorization` header
  fall back to a single hardcoded demo user (`DEMO_USER_ID`,
  `src/lib/config/demo-credentials.ts`).
- Every route resolves its user via `getAuthContext(request)`
  (`src/lib/auth/getAuthContext.ts`), which checks a real Supabase JWT
  first and only falls back to the demo user when demo mode is on and no
  token was sent.
- The Google OAuth consent screen is registered in **test mode** (up to 100
  test users, no Google review needed) against a dedicated demo Google
  account — not any team member's personal account.
- Notion uses a single internal integration token
  (`NOTION_TOKEN`/`NOTION_DATABASE_ID`) rather than per-user OAuth.

## Steps to switch to production

1. **Turn off demo mode**
   ```
   AURA_DEMO_MODE=false   # or unset entirely
   ```
   Every route now requires a real `Authorization: Bearer <supabase-jwt>`
   header — unauthenticated requests get `401`, not the demo fallback.

2. **Publish the Google OAuth consent screen**
   In Google Cloud Console, move the OAuth app from "Testing" to "In
   production." This requires Google's verification if you request
   sensitive scopes (Gmail/Calendar readonly qualify) — start this early,
   it can take days. No code changes.

3. **Point `GOOGLE_REDIRECT_URI` at the production domain**
   Update the env var and the redirect URI registered in Google Cloud
   Console to `https://<your-domain>/api/connectors/google/callback`.

4. **Set a dedicated `OAUTH_STATE_SECRET`**
   Demo/dev can rely on the fallback to `SUPABASE_SERVICE_ROLE_KEY`;
   production should set its own value so state-signing isn't coupled to
   the DB admin key.

5. **Rotate all secrets that ever touched a shared/demo environment**
   `GOOGLE_CLIENT_SECRET`, `NOTION_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY` —
   generate fresh values for production, stored in your host's secret
   manager, never in `.env` files on disk in prod.

6. **Notion: decide OAuth vs. continued internal-integration model**
   If AURA is going to be installed by multiple real Notion workspaces,
   `NotionConnector.authorize()`/`handleCallback()` need real OAuth
   (currently no-ops — see `src/lib/connectors/notion.ts`). If every
   customer shares one Notion workspace (current assumption), no change is
   needed.

7. **Confirm RLS is doing real work**
   `supabase/migrations/002_rls_and_roles.sql` scopes every table to
   `tenant_id = auth.uid()`. This has been true since that migration
   shipped — nothing to flip here, just verify the anon key (not the
   service role key) is what any client-side Supabase access uses.

## What does NOT change

- Canonical schema, connector interface, queue/worker code, all API route
  handlers — identical in demo and production.
- The only difference between a demo user and a real user, from the
  backend's perspective, is that a real user has a genuine Supabase Auth
  session instead of `AURA_DEMO_MODE` fallback. Same code path either way.

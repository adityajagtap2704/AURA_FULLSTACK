# Demo → Production Switch

Per Section 3.1 of the build plan, moving AURA from the demo environment to
real users must be a **config change only** — no code rewrite. As of this
update, the demo-user auth bypass (`AURA_DEMO_MODE` / `DEMO_USER_ID`) has
been removed entirely: every route always requires a real
`Authorization: Bearer <supabase-jwt>` header via `getAuthContext()`
(`src/lib/auth/getAuthContext.ts`). There is no unauthenticated fallback —
the backend behaves the same for the first user and the thousandth.

## What "demo" still means

- The Google OAuth consent screen is registered in **test mode** (up to 100
  test users, no Google review needed) against a dedicated demo Google
  account — not any team member's personal account.
- The Notion integration is a **public integration** in "development" mode
  until submitted for Notion's review — works for real per-user OAuth
  connections either way, review just gates wider public distribution.

Neither of those is an auth bypass — they're just which external accounts
the connectors talk to. Both Google and Notion are fully per-user OAuth now:
every signed-up user connects and syncs their own workspace, never someone
else's data.

## Steps to go fully to production

1. **Publish the Google OAuth consent screen**
   In Google Cloud Console, move the OAuth app from "Testing" to "In
   production." This requires Google's verification if you request
   sensitive scopes (Gmail/Calendar readonly qualify) — start this early,
   it can take days. No code changes.

2. **Point `GOOGLE_REDIRECT_URI` at the production domain**
   Update the env var and the redirect URI registered in Google Cloud
   Console to `https://<your-domain>/api/connectors/google/callback`.

3. **Set a dedicated `OAUTH_STATE_SECRET`**
   Dev can rely on the fallback to `SUPABASE_SERVICE_ROLE_KEY`; production
   should set its own value so state-signing isn't coupled to the DB admin
   key.

4. **Rotate all secrets that ever touched a shared/demo environment**
   `GOOGLE_CLIENT_SECRET`, `NOTION_OAUTH_CLIENT_SECRET`,
   `SUPABASE_SERVICE_ROLE_KEY` — generate fresh values for production,
   stored in your host's secret manager, never in `.env` files on disk in
   prod.

5. **Point `NOTION_REDIRECT_URI` at the production domain, and submit the
   Notion integration for review**
   Update the env var and the redirect URI registered on the Notion
   integration to `https://<your-domain>/api/connectors/notion/callback`.
   Submit the integration for Notion's review to lift it out of
   "development" mode if you want it usable by workspaces outside your own
   testers.

6. **Confirm RLS is doing real work**
   `supabase/migrations/002_rls_and_roles.sql` scopes every table to
   `tenant_id = auth.uid()`. This has been true since that migration
   shipped — nothing to flip here, just verify the anon key (not the
   service role key) is what any client-side Supabase access uses.

7. **Promote an admin**
   There is no bootstrap admin user anymore. To grant the `ADMIN` role to a
   real account, run against Supabase directly:
   ```sql
   UPDATE public.profiles SET role = 'ADMIN' WHERE id = '<user-uuid>';
   ```

## What does NOT change

- Canonical schema, connector interface, queue/worker code, all API route
  handlers, and the auth model — identical for every user, demo or real.

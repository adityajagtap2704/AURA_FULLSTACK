# Environment Variables

Authoritative list of every environment variable AURA's backend reads. Copy
`.env.example` (or the table below) into `.env.local` for local dev — never
commit real values. Pre-commit hooks and `.gitignore` block `.env*` files;
if a secret is ever committed, rotate it immediately.

| Variable | Required | Owner | Description |
|---|---|---|---|
| `GOOGLE_CLIENT_ID` | Yes | Gaurav | Google OAuth app client ID (Calendar + Gmail scopes). |
| `GOOGLE_CLIENT_SECRET` | Yes | Gaurav | Google OAuth client secret. **Never commit.** |
| `GOOGLE_REDIRECT_URI` | Yes | Gaurav | Must exactly match the redirect URI registered in Google Cloud Console, e.g. `http://localhost:3000/api/connectors/google/callback`. |
| `NOTION_TOKEN` | Yes | Aditya | Notion internal integration token (Phase 1 uses a single shared integration, not per-user OAuth). |
| `NOTION_DATABASE_ID` | Yes | Aditya | ID of the Notion database synced as canonical Tasks. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Allauddin | Supabase project URL. Public — safe in browser bundles. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Allauddin | Supabase anon key. Public — RLS policies (see `supabase/migrations/002_rls_and_roles.sql`) are what actually restrict access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Allauddin | Bypasses RLS entirely. Server-side only — never sent to the browser, never used in a client component. |
| `OAUTH_STATE_SECRET` | Recommended | Allauddin | HMAC secret used to sign the OAuth `state` param so the Google callback can verify which user initiated the flow. Falls back to `SUPABASE_SERVICE_ROLE_KEY` if unset — set a dedicated value in production. |
| `DEMO_USER_ID` | No | Gaurav | UUID used as the demo tenant. Defaults to `00000000-0000-0000-0000-000000000001`. Only read when `AURA_DEMO_MODE=true`. |
| `AURA_DEMO_MODE` | No | Gaurav | Set to `true` to let unauthenticated requests fall back to `DEMO_USER_ID` (local/demo only). Must be unset or `false` in production — see [PRODUCTION_SWITCH.md](./PRODUCTION_SWITCH.md). |
| `REDIS_URL` | Yes | Aditya | BullMQ connection string, e.g. `redis://localhost:6379` (matches `docker-compose.yml`). |
| `NODE_ENV` | No | — | Standard Node environment flag. |

## Setting up locally

```bash
cp .env.example .env.local   # if an example file exists, otherwise create from the table above
docker compose up -d          # starts Redis
npm run dev                   # Next.js app
npm run worker                # BullMQ sync worker (separate process)
```

## Rotation policy

Any secret (`GOOGLE_CLIENT_SECRET`, `NOTION_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`,
`OAUTH_STATE_SECRET`) that is ever committed to git — even in a since-reverted
commit — must be rotated immediately. Git history retains it regardless of
later deletion.

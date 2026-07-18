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
| `NOTION_OAUTH_CLIENT_ID` | Yes | Aditya | Notion **public integration** OAuth client ID — each user connects their own workspace, no shared token. |
| `NOTION_OAUTH_CLIENT_SECRET` | Yes | Aditya | Notion OAuth client secret. **Never commit.** |
| `NOTION_REDIRECT_URI` | Yes | Aditya | Must exactly match the redirect URI registered on the Notion integration, e.g. `http://localhost:3000/api/connectors/notion/callback`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Allauddin | Supabase project URL. Public — safe in browser bundles. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Allauddin | Supabase anon key. Public — RLS policies (see `supabase/migrations/002_rls_and_roles.sql`) are what actually restrict access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Allauddin | Bypasses RLS entirely. Server-side only — never sent to the browser, never used in a client component. |
| `OAUTH_STATE_SECRET` | Recommended | Allauddin | HMAC secret used to sign the OAuth `state` param so the Google callback can verify which user initiated the flow. Falls back to `SUPABASE_SERVICE_ROLE_KEY` if unset — set a dedicated value in production. |
| `REDIS_URL` | Yes | Aditya | BullMQ connection string, e.g. `redis://localhost:6379` (matches `docker-compose.yml`). |
| `FRONTEND_URL` | Yes | Gaurav | Origin of the separate `frontend/` app (e.g. `http://localhost:3001`, or the production frontend domain). Used to build the redirect after `/api/connectors/google/callback` completes — this backend has no dashboard UI of its own. |
| `NODE_ENV` | No | — | Standard Node environment flag. |

## Setting up locally

```bash
cp .env.example .env.local   # if an example file exists, otherwise create from the table above
docker compose up -d          # starts Redis
npm run dev                   # Next.js app
npm run worker                # BullMQ sync worker (separate process)
```

## Rotation policy

Any secret (`GOOGLE_CLIENT_SECRET`, `NOTION_OAUTH_CLIENT_SECRET`,
`SUPABASE_SERVICE_ROLE_KEY`, `OAUTH_STATE_SECRET`) that is ever committed to
git — even in a since-reverted commit — must be rotated immediately. Git
history retains it regardless of later deletion.

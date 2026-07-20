// Dummy values so modules that construct a Supabase client at import time
// (e.g. src/lib/supabase/server.ts) don't throw — no network call happens
// at construction, only when a query actually runs, and those are mocked
// per-test where needed.
process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||= 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'test-service-role-key';
process.env.GOOGLE_CLIENT_ID ||= 'test-client-id';
process.env.GOOGLE_CLIENT_SECRET ||= 'test-client-secret';
process.env.GOOGLE_REDIRECT_URI ||= 'http://localhost:3000/api/connectors/google/callback';
process.env.OAUTH_STATE_SECRET ||= 'test-state-secret';

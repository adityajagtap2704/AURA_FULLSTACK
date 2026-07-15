-- AURA Phase 1 - Real per-user RLS + RBAC
-- Replaces the "allow all" demo policies from 001 with policies scoped to
-- auth.uid(), and introduces USER/ADMIN roles per Section 2/7.1 of the build plan.

-----------------------------------------------------------
-- PROFILES (role storage)
-----------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Every new Supabase Auth user gets a USER-role profile automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role) VALUES (NEW.id, 'USER');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
    );

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-----------------------------------------------------------
-- REPLACE DEMO-PERMISSIVE POLICIES WITH TENANT-SCOPED ONES
-----------------------------------------------------------
-- Phase 1: tenant_id == auth.uid() (single-user tenants). Admins can read
-- across tenants for support/debugging; only the service role (used by the
-- sync worker and admin API) bypasses RLS entirely.

DROP POLICY IF EXISTS "Allow all for demo" ON public.tasks;
DROP POLICY IF EXISTS "Allow all for demo" ON public.events;
DROP POLICY IF EXISTS "Allow all for demo" ON public.messages;
DROP POLICY IF EXISTS "Allow all for demo" ON public.documents;
DROP POLICY IF EXISTS "Allow all for demo" ON public.oauth_tokens;
DROP POLICY IF EXISTS "Allow all for demo" ON public.sync_jobs;

CREATE POLICY "Users manage own tasks" ON public.tasks
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users manage own events" ON public.events
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users manage own messages" ON public.messages
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users manage own documents" ON public.documents
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users manage own oauth tokens" ON public.oauth_tokens
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users read own sync jobs" ON public.sync_jobs
    FOR SELECT USING (tenant_id = auth.uid());

CREATE POLICY "Admins read all sync jobs" ON public.sync_jobs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
    );

COMMENT ON TABLE public.profiles IS 'RBAC role storage — USER (default) or ADMIN. Auto-created on signup via on_auth_user_created trigger.';

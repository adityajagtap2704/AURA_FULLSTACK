-- AURA Phase 1 - Fix infinite recursion in profiles RLS policy
--
-- "Admins can read all profiles" (002/003) does
--   EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'ADMIN')
-- from inside a policy ON public.profiles. Postgres evaluates every SELECT
-- policy on a table (OR'd together) for any query against it, including the
-- EXISTS subquery itself — which re-triggers the same policy, recursing
-- forever (error 42P17 "infinite recursion detected in policy for relation
-- profiles"). This broke every profile read (own-row included, since all
-- policies are evaluated), which the old DEMO_USER_ID bypass masked because
-- the demo path never queried this table for real.
--
-- Fix: move the admin check into a SECURITY DEFINER function. Functions
-- created by the migration-running role (postgres, which has BYPASSRLS in
-- Supabase) execute with that privilege, so the lookup inside it does not
-- re-trigger RLS on profiles.

CREATE OR REPLACE FUNCTION public.is_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = uid AND role = 'ADMIN'
  );
$$;

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins read all sync jobs" ON public.sync_jobs;
CREATE POLICY "Admins read all sync jobs" ON public.sync_jobs
    FOR SELECT USING (public.is_admin(auth.uid()));

COMMENT ON FUNCTION public.is_admin IS 'SECURITY DEFINER helper so admin-role RLS checks do not recurse back into profiles RLS.';

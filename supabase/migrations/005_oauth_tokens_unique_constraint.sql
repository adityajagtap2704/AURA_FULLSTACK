-- AURA Phase 1 - Add missing UNIQUE(user_id, provider) on oauth_tokens
--
-- migrations/001 defines this constraint, but this project's database was
-- originally built via the Table Editor GUI (see the "Steps to Create
-- Tables via Table Editor" doc), which never actually added it to
-- oauth_tokens — only the tenant_id/source/source_id uniques on
-- tasks/events/messages/documents were created. Without it, every
-- `.upsert(..., { onConflict: 'user_id,provider' })` call in
-- GoogleConnector/NotionConnector fails with:
--   42P10 "there is no unique or exclusion constraint matching the ON
--   CONFLICT specification"
--
-- Duplicate (user_id, provider) rows already exist from before this was
-- caught (each reconnect inserted a new row instead of updating one), so
-- those must be collapsed to one row each before the constraint can be
-- added at all.

-- Keep only the most recently created row per (user_id, provider); ties
-- broken by id so exactly one survivor is picked even when timestamps
-- collide (as several existing duplicate rows do).
DELETE FROM public.oauth_tokens
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY user_id, provider
      ORDER BY created_at DESC, id DESC
    ) AS rn
    FROM public.oauth_tokens
  ) ranked
  WHERE rn > 1
);

ALTER TABLE public.oauth_tokens
  ADD CONSTRAINT oauth_tokens_user_provider_unique UNIQUE (user_id, provider);

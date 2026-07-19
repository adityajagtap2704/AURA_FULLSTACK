-- AURA Phase 1 - Add optional fields to events table
-- Description, category color, reminder, and meeting links

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'orange';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS reminder TEXT DEFAULT 'none';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS meeting_link TEXT;

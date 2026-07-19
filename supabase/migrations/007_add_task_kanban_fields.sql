-- Migration: Add Kanban task fields to the tasks table
-- These columns support the new local task creation feature (priority, description, assignee, labels)

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS assignee TEXT,
  ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}';

-- Update the unique constraint to allow locally-created tasks
-- Local tasks use 'local' as source + a timestamp-based source_id, so no conflict needed
-- But we relax the constraint to be safe for duplicate local task creation
COMMENT ON COLUMN public.tasks.priority IS 'Task priority: Low, Medium, High, Critical';
COMMENT ON COLUMN public.tasks.description IS 'Optional task description or notes';
COMMENT ON COLUMN public.tasks.assignee IS 'Assigned user name or email (optional)';
COMMENT ON COLUMN public.tasks.labels IS 'Array of label strings for categorization';

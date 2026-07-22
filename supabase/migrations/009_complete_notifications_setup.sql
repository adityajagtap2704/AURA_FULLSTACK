-- Migration 009 — Complete Notifications Setup
-- This script creates the notifications table, enables RLS and Realtime, and sets up all database triggers.
-- Safe to run whether previous migrations were run or not.

-- 1. Create notifications table if it does not exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'task', 'calendar', 'gmail', 'message', 'document', 'ai', 'integration', 'profile', 'settings', 'admin'
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    source_id TEXT, -- Tracks external item IDs (e.g., Google Event ID, Gmail Message ID)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index to quickly lookup notifications by source_id
CREATE INDEX IF NOT EXISTS idx_notifications_source_id ON public.notifications(source_id);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy (tenant_id = auth.uid() in single-tenant Phase 1)
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

-- Enable Realtime for notifications
BEGIN;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.notifications;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
COMMIT;


-- 2. Trigger functions and triggers

-- A. Tasks trigger
CREATE OR REPLACE FUNCTION public.on_task_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.source = 'local' THEN
      INSERT INTO public.notifications (tenant_id, title, description, type, link)
      VALUES (NEW.tenant_id, 'Task Created', 'Task "' || NEW.title || '" was added.', 'task', '/dashboard/tasks');
    ELSE
      INSERT INTO public.notifications (tenant_id, title, description, type, link)
      VALUES (NEW.tenant_id, 'Task Synced', 'Task "' || NEW.title || '" synced from ' || initcap(NEW.source) || '.', 'task', '/dashboard/tasks');
    END IF;
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (tenant_id, title, description, type, link)
    VALUES (NEW.tenant_id, 'Task Status Updated', 'Task "' || NEW.title || '" updated to "' || NEW.status || '".', 'task', '/dashboard/tasks');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_task_changed ON public.tasks;
CREATE TRIGGER tr_task_changed
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.on_task_changed();


-- B. Events trigger (Google Calendar sync with Reschedules and Cancellations)
CREATE OR REPLACE FUNCTION public.on_event_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Prevent duplicate notifications for the same synced event
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications 
      WHERE tenant_id = NEW.tenant_id AND source_id = NEW.source_id AND type = 'calendar'
    ) THEN
      INSERT INTO public.notifications (tenant_id, title, description, type, link, source_id)
      VALUES (
        NEW.tenant_id, 
        'New Event Added', 
        'Event "' || NEW.title || '" has been scheduled.', 
        'calendar', 
        '/dashboard/calendar', 
        NEW.source_id
      );
    END IF;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only generate rescheduling notification if critical fields changed
    IF OLD.title IS DISTINCT FROM NEW.title OR 
       OLD.start_time IS DISTINCT FROM NEW.start_time OR 
       OLD.description IS DISTINCT FROM NEW.description THEN
       
      -- Update existing notification if it exists and mark unread
      UPDATE public.notifications
      SET title = 'Event Rescheduled',
          description = 'Event "' || NEW.title || '" details or timings have changed.',
          is_read = FALSE,
          updated_at = NOW()
      WHERE tenant_id = NEW.tenant_id AND source_id = NEW.source_id AND type = 'calendar';
      
      -- Fallback: If previous notification was cleared, create a new one
      IF NOT FOUND THEN
        INSERT INTO public.notifications (tenant_id, title, description, type, link, source_id)
        VALUES (
          NEW.tenant_id, 
          'Event Rescheduled', 
          'Event "' || NEW.title || '" details or timings have changed.', 
          'calendar', 
          '/dashboard/calendar', 
          NEW.source_id
        );
      END IF;
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Cancel/Remove the notification from the list if deleted upstream
    DELETE FROM public.notifications
    WHERE tenant_id = OLD.tenant_id AND source_id = OLD.source_id AND type = 'calendar';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on events
DROP TRIGGER IF EXISTS tr_event_inserted ON public.events;
DROP TRIGGER IF EXISTS tr_event_changed ON public.events;

CREATE TRIGGER tr_event_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.on_event_changed();


-- C. Messages trigger (Gmail sync with Stars and Deletes)
CREATE OR REPLACE FUNCTION public.on_message_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Prevent duplicate message notifications
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications 
      WHERE tenant_id = NEW.tenant_id AND source_id = NEW.source_id AND type = 'gmail'
    ) THEN
      INSERT INTO public.notifications (tenant_id, title, description, type, link, source_id)
      VALUES (
        NEW.tenant_id, 
        'New Message Received', 
        'From ' || NEW.sender || ': "' || COALESCE(NEW.subject, '(No Subject)') || '"', 
        'gmail', 
        '/dashboard/gmail', 
        NEW.source_id
      );
    END IF;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- If star/flag status changes, update the notification state
    IF OLD.flagged IS DISTINCT FROM NEW.flagged THEN
      UPDATE public.notifications
      SET title = CASE WHEN NEW.flagged THEN 'Message Starred' ELSE 'Message Unstarred' END,
          description = 'Subject: "' || COALESCE(NEW.subject, '(No Subject)') || '"',
          is_read = FALSE,
          updated_at = NOW()
      WHERE tenant_id = NEW.tenant_id AND source_id = NEW.source_id AND type = 'gmail';
      
      -- Fallback: Create new notification if cleared
      IF NOT FOUND THEN
        INSERT INTO public.notifications (tenant_id, title, description, type, link, source_id)
        VALUES (
          NEW.tenant_id, 
          CASE WHEN NEW.flagged THEN 'Message Starred' ELSE 'Message Unstarred' END,
          'Subject: "' || COALESCE(NEW.subject, '(No Subject)') || '"',
          'gmail',
          '/dashboard/gmail',
          NEW.source_id
        );
      END IF;
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Delete the notification when email is removed
    DELETE FROM public.notifications
    WHERE tenant_id = OLD.tenant_id AND source_id = OLD.source_id AND type = 'gmail';
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on messages
DROP TRIGGER IF EXISTS tr_message_inserted ON public.messages;
DROP TRIGGER IF EXISTS tr_message_changed ON public.messages;

CREATE TRIGGER tr_message_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.on_message_changed();


-- D. Documents trigger
CREATE OR REPLACE FUNCTION public.on_document_inserted()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (tenant_id, title, description, type, link)
  VALUES (NEW.tenant_id, 'New Document Synced', 'Document "' || NEW.title || '" synced from ' || initcap(NEW.source) || '.', 'document', '/dashboard/documents');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_document_inserted ON public.documents;
CREATE TRIGGER tr_document_inserted
  AFTER INSERT ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.on_document_inserted();


-- E. OAuth Tokens trigger
CREATE OR REPLACE FUNCTION public.on_oauth_token_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (tenant_id, title, description, type, link)
    VALUES (NEW.user_id, 'Integration Connected', 'Successfully connected to ' || initcap(NEW.provider) || '.', 'integration', '/dashboard/integrations');
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.notifications (tenant_id, title, description, type, link)
    VALUES (OLD.user_id, 'Integration Disconnected', 'Disconnected from ' || initcap(OLD.provider) || '.', 'integration', '/dashboard/integrations');
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_oauth_token_changed ON public.oauth_tokens;
CREATE TRIGGER tr_oauth_token_changed
  AFTER INSERT OR DELETE ON public.oauth_tokens
  FOR EACH ROW EXECUTE FUNCTION public.on_oauth_token_changed();


-- F. Sync Jobs trigger
CREATE OR REPLACE FUNCTION public.on_sync_job_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    INSERT INTO public.notifications (tenant_id, title, description, type, link)
    VALUES (NEW.tenant_id, 'Sync Completed', initcap(NEW.connector) || ' sync completed: ' || NEW.items_synced || ' items synced.', 'settings', '/dashboard/settings');
  ELSIF NEW.status = 'failed' THEN
    INSERT INTO public.notifications (tenant_id, title, description, type, link)
    VALUES (NEW.tenant_id, 'Sync Failed', initcap(NEW.connector) || ' sync failed: ' || COALESCE(NEW.error_message, 'Unknown error'), 'admin', '/dashboard/settings');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_sync_job_changed ON public.sync_jobs;
CREATE TRIGGER tr_sync_job_changed
  AFTER UPDATE ON public.sync_jobs
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('completed', 'failed'))
  EXECUTE FUNCTION public.on_sync_job_changed();


-- G. Profile trigger
CREATE OR REPLACE FUNCTION public.on_profile_changed()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (tenant_id, title, description, type, link)
  VALUES (NEW.id, 'Profile Settings Updated', 'Your profile role has been updated to ' || NEW.role || '.', 'profile', '/dashboard/settings');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_profile_changed ON public.profiles;
CREATE TRIGGER tr_profile_changed
  AFTER UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.on_profile_changed();


-- 3. Backfill notifications for existing events and messages to populate the dropdown instantly
INSERT INTO public.notifications (tenant_id, title, description, type, link, source_id, created_at)
SELECT 
  tenant_id, 
  'New Event Added', 
  'Event "' || title || '" has been scheduled.', 
  'calendar', 
  '/dashboard/calendar', 
  source_id,
  COALESCE(start_time, NOW())
FROM public.events
WHERE source = 'google_calendar'
ON CONFLICT DO NOTHING;

INSERT INTO public.notifications (tenant_id, title, description, type, link, source_id, created_at)
SELECT 
  tenant_id, 
  'New Message Received', 
  'From ' || sender || ': "' || COALESCE(subject, '(No Subject)') || '"', 
  'gmail', 
  '/dashboard/gmail', 
  source_id,
  COALESCE(created_at, NOW())
FROM public.messages
WHERE source = 'gmail'
ON CONFLICT DO NOTHING;


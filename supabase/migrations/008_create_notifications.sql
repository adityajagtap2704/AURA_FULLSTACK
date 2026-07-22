-- Migration 008 — Create notifications table and triggers
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL, -- 'task', 'calendar', 'gmail', 'message', 'document', 'ai', 'integration', 'profile', 'settings', 'admin'
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy (tenant_id = auth.uid() in single-tenant Phase 1)
CREATE POLICY "Users manage own notifications" ON public.notifications
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

-- Enable Realtime for notifications
BEGIN;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.notifications;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
COMMIT;

-- Triggers to auto-create notifications:
-- 1. Tasks trigger
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

-- 2. Events trigger
CREATE OR REPLACE FUNCTION public.on_event_inserted()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (tenant_id, title, description, type, link)
  VALUES (NEW.tenant_id, 'New Event Added', 'Event "' || NEW.title || '" has been scheduled.', 'calendar', '/dashboard/calendar');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_event_inserted ON public.events;
CREATE TRIGGER tr_event_inserted
  AFTER INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.on_event_inserted();

-- 3. Messages trigger
CREATE OR REPLACE FUNCTION public.on_message_inserted()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (tenant_id, title, description, type, link)
  VALUES (NEW.tenant_id, 'New Message Received', 'From ' || NEW.sender || ': "' || COALESCE(NEW.subject, '(No Subject)') || '"', 'gmail', '/dashboard/gmail');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_message_inserted ON public.messages;
CREATE TRIGGER tr_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.on_message_inserted();

-- 4. Documents trigger
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

-- 5. OAuth Tokens trigger
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

-- 6. Sync Jobs trigger
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

-- 7. Profile trigger
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

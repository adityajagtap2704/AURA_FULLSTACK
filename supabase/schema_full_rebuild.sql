-- =========================================================================
-- AURA — Full schema rebuild
-- =========================================================================
-- Single-file equivalent of migrations 001-012, with two corrections made
-- against the current codebase rather than the migration history verbatim:
--
--   1. embeddings.embedding_model (not "model_name" — 010 defined the
--      table with `embedding_model` but its own later indexes/function
--      referenced a `model_name` column that was never created. The app
--      (src/lib/embeddings/pipeline.ts, search.ts, generate.ts) uses
--      `embedding_model` throughout, so that's what this script builds).
--   2. match_embeddings() takes `match_embedding_model` and returns
--      `embedding_model`, matching search.ts's actual RPC call and
--      src/lib/supabase/database.types.ts's generated Functions type.
--
-- Run this once against an empty Supabase project (SQL Editor > New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE
-- / DROP ... IF EXISTS before CREATE).
-- =========================================================================

-- -------------------------------------------------------------------------
-- EXTENSIONS
-- -------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- -------------------------------------------------------------------------
-- SHARED TRIGGER FUNCTION
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------------------------------
-- PROFILES (role storage, keyed to auth.users)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SECURITY DEFINER so admin-role checks in RLS policies don't recurse back
-- into profiles' own RLS (see migrations/004 for the incident this fixed).
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

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin(auth.uid()));

-- -------------------------------------------------------------------------
-- CANONICAL TABLES
-- -------------------------------------------------------------------------

-- Tasks (Notion, local kanban, etc.)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    status TEXT,
    due_date TIMESTAMPTZ,
    source TEXT NOT NULL,
    source_id TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',
    description TEXT,
    assignee TEXT,
    labels TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, source, source_id)
);

-- Events (Google Calendar, etc.)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    attendees JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    color TEXT DEFAULT 'orange',
    reminder TEXT DEFAULT 'none',
    meeting_link TEXT,
    source TEXT NOT NULL,
    source_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, source, source_id)
);

-- Messages (Gmail, etc.)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    sender TEXT NOT NULL,
    subject TEXT,
    snippet TEXT,
    flagged BOOLEAN DEFAULT FALSE,
    source TEXT NOT NULL,
    source_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, source, source_id)
);

-- Documents (Notion, Google Drive, etc.)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    last_modified TIMESTAMPTZ,
    source TEXT NOT NULL,
    source_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, source, source_id)
);

-- -------------------------------------------------------------------------
-- OAUTH & SYNC INFRASTRUCTURE
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.oauth_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    provider TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    needs_reauth BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

CREATE TABLE IF NOT EXISTS public.sync_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL,
    connector TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    items_synced INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- NOTIFICATIONS
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    source_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- EMBEDDINGS (semantic search)
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    object_type TEXT NOT NULL CHECK (object_type IN ('task', 'event', 'message', 'document')),
    object_id UUID NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(768) NOT NULL,
    embedding_model TEXT NOT NULL DEFAULT 'BAAI/bge-base-en-v1.5',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tenant_id, object_type, object_id, embedding_model)
);

-- -------------------------------------------------------------------------
-- INDEXES
-- -------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON public.tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_events_tenant_id ON public.events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_messages_tenant_id ON public.messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_flagged ON public.messages(flagged);
CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON public.documents(tenant_id);

CREATE INDEX IF NOT EXISTS idx_oauth_tokens_user_id ON public.oauth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_tenant_id ON public.sync_jobs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_status ON public.sync_jobs(status);

CREATE INDEX IF NOT EXISTS idx_notifications_source_id ON public.notifications(source_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON public.notifications(tenant_id);

CREATE INDEX IF NOT EXISTS idx_embeddings_tenant ON public.embeddings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_object ON public.embeddings(object_type, object_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_tenant_model ON public.embeddings(tenant_id, embedding_model);
CREATE INDEX IF NOT EXISTS idx_embeddings_vector_hnsw ON public.embeddings
    USING hnsw (embedding vector_cosine_ops);

-- -------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -------------------------------------------------------------------------

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
-- embeddings has no RLS: only ever read/written by the service-role worker
-- and the SECURITY INVOKER match_embeddings() RPC below, matching 010.

DROP POLICY IF EXISTS "Users manage own tasks" ON public.tasks;
CREATE POLICY "Users manage own tasks" ON public.tasks
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own events" ON public.events;
CREATE POLICY "Users manage own events" ON public.events
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own messages" ON public.messages;
CREATE POLICY "Users manage own messages" ON public.messages
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own documents" ON public.documents;
CREATE POLICY "Users manage own documents" ON public.documents
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Users manage own oauth tokens" ON public.oauth_tokens;
CREATE POLICY "Users manage own oauth tokens" ON public.oauth_tokens
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users read own sync jobs" ON public.sync_jobs;
CREATE POLICY "Users read own sync jobs" ON public.sync_jobs
    FOR SELECT USING (tenant_id = auth.uid());

DROP POLICY IF EXISTS "Admins read all sync jobs" ON public.sync_jobs;
CREATE POLICY "Admins read all sync jobs" ON public.sync_jobs
    FOR SELECT USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications
    FOR ALL USING (tenant_id = auth.uid()) WITH CHECK (tenant_id = auth.uid());

-- -------------------------------------------------------------------------
-- REALTIME (notifications bell)
-- -------------------------------------------------------------------------

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;

-- -------------------------------------------------------------------------
-- updated_at TRIGGERS
-- -------------------------------------------------------------------------

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON public.documents;
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_oauth_tokens_updated_at ON public.oauth_tokens;
CREATE TRIGGER update_oauth_tokens_updated_at BEFORE UPDATE ON public.oauth_tokens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -------------------------------------------------------------------------
-- NOTIFICATION TRIGGERS
-- -------------------------------------------------------------------------
-- Product decision (migrations/011): the bell only reflects real content
-- synced from connected tools — tasks/events/messages/documents. No
-- triggers on sync_jobs, oauth_tokens, or profiles.

-- Tasks
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

-- Events (with reschedule/cancel handling)
CREATE OR REPLACE FUNCTION public.on_event_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
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
    IF OLD.title IS DISTINCT FROM NEW.title OR
       OLD.start_time IS DISTINCT FROM NEW.start_time OR
       OLD.description IS DISTINCT FROM NEW.description THEN

      UPDATE public.notifications
      SET title = 'Event Rescheduled',
          description = 'Event "' || NEW.title || '" details or timings have changed.',
          is_read = FALSE,
          updated_at = NOW()
      WHERE tenant_id = NEW.tenant_id AND source_id = NEW.source_id AND type = 'calendar';

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
    DELETE FROM public.notifications
    WHERE tenant_id = OLD.tenant_id AND source_id = OLD.source_id AND type = 'calendar';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_event_changed ON public.events;
CREATE TRIGGER tr_event_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.on_event_changed();

-- Messages (with star/unstar and delete handling)
CREATE OR REPLACE FUNCTION public.on_message_changed()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
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
    IF OLD.flagged IS DISTINCT FROM NEW.flagged THEN
      UPDATE public.notifications
      SET title = CASE WHEN NEW.flagged THEN 'Message Starred' ELSE 'Message Unstarred' END,
          description = 'Subject: "' || COALESCE(NEW.subject, '(No Subject)') || '"',
          is_read = FALSE,
          updated_at = NOW()
      WHERE tenant_id = NEW.tenant_id AND source_id = NEW.source_id AND type = 'gmail';

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
    DELETE FROM public.notifications
    WHERE tenant_id = OLD.tenant_id AND source_id = OLD.source_id AND type = 'gmail';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_message_changed ON public.messages;
CREATE TRIGGER tr_message_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.on_message_changed();

-- Documents
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

-- -------------------------------------------------------------------------
-- SEMANTIC SEARCH RPC
-- -------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.match_embeddings(
  query_embedding VECTOR(768),
  match_tenant_id UUID,
  match_embedding_model TEXT,
  match_threshold DOUBLE PRECISION DEFAULT 0,
  match_count INTEGER DEFAULT 10,
  match_object_types TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  tenant_id UUID,
  object_type TEXT,
  object_id UUID,
  content TEXT,
  embedding_model TEXT,
  similarity DOUBLE PRECISION
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    e.id,
    e.tenant_id,
    e.object_type,
    e.object_id,
    e.content,
    e.embedding_model,
    (1 - (e.embedding <=> query_embedding))::DOUBLE PRECISION AS similarity
  FROM public.embeddings e
  WHERE e.tenant_id = match_tenant_id
    AND e.embedding_model = match_embedding_model
    AND (
      match_object_types IS NULL
      OR e.object_type = ANY(match_object_types)
    )
    AND (1 - (e.embedding <=> query_embedding)) >= match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT LEAST(GREATEST(match_count, 1), 50);
$$;

-- =========================================================================
-- Done. Every existing Supabase Auth user needs a matching profiles row —
-- the on_auth_user_created trigger only fires for NEW signups. If you're
-- rebuilding onto auth.users that already has accounts, backfill with:
--
--   INSERT INTO public.profiles (id, role)
--   SELECT id, 'USER' FROM auth.users
--   ON CONFLICT (id) DO NOTHING;
-- =========================================================================

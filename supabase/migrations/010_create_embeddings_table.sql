CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    tenant_id UUID NOT NULL,

    object_type TEXT NOT NULL
        CHECK (object_type IN ('task', 'event', 'message', 'document')),

    object_id UUID NOT NULL,

    content TEXT NOT NULL,

    embedding VECTOR(768) NOT NULL,

    embedding_model TEXT NOT NULL DEFAULT 'BAAI/bge-base-en-v1.5',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(object_type, object_id)
);


--- indexes ---

CREATE INDEX idx_embeddings_tenant
ON embeddings (tenant_id);

CREATE INDEX idx_embeddings_object
ON embeddings (object_type, object_id);


create extension if not exists vector;

-- Required by pipeline.ts upsert(... onConflict ...)
create unique index if not exists embeddings_object_model_unique
on public.embeddings (
  tenant_id,
  object_type,
  object_id,
  model_name
);

-- Improve tenant/model filtering.
create index if not exists embeddings_tenant_model_idx
on public.embeddings (
  tenant_id,
  model_name
);

-- Vector index.
--
-- For a very small Phase 1 dataset, exact search is already sufficient.
-- The HNSW index becomes useful as the embeddings table grows.
create index if not exists embeddings_vector_hnsw_idx
on public.embeddings
using hnsw (embedding vector_cosine_ops);

create or replace function public.match_embeddings(
  query_embedding vector(768),
  match_tenant_id uuid,
  match_model_name text,
  match_threshold double precision default 0,
  match_count integer default 10,
  match_object_types text[] default null
)
returns table (
  id uuid,
  tenant_id uuid,
  object_type text,
  object_id uuid,
  content text,
  model_name text,
  similarity double precision
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    e.id,
    e.tenant_id,
    e.object_type,
    e.object_id,
    e.content,
    e.model_name,
    (1 - (e.embedding <=> query_embedding))::double precision
      as similarity
  from public.embeddings e
  where e.tenant_id = match_tenant_id
    and e.model_name = match_model_name
    and (
      match_object_types is null
      or e.object_type = any(match_object_types)
    )
    and (
      1 - (e.embedding <=> query_embedding)
    ) >= match_threshold
  order by e.embedding <=> query_embedding
  limit least(greatest(match_count, 1), 50);
$$;
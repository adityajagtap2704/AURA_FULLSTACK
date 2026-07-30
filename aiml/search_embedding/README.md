# 🔍 Search & Embedding System (`aiml/search_embedding/`)

The **Search & Embedding System** powers semantic vector search and multi-source text search across Google Calendar events, Notion tasks, Gmail emails, and documents.

---

## 🔎 Hybrid Search Architecture Flowchart

```mermaid
flowchart TD
    UserQuery[User Types Query in Dashboard Search Bar e.g. 'last meeting'] --> TenantCheck[Resolve Tenant ID & Session Token]
    TenantCheck --> EmbedChoice{Is GEMINI_API_KEY set?}
    
    EmbedChoice -- Yes: Vercel Production Safe --> GeminiREST[Generate Embedding via Google Gemini REST API text-embedding-004]
    EmbedChoice -- No: Local Env --> HFLocal[Try Local Hugging Face Transformers.js ONNX]
    
    GeminiREST --> TryRPC{Attempt pgvector match_embeddings RPC}
    HFLocal --> TryRPC
    
    TryRPC -- Success & Vector Matches Found --> ReturnVector[Return Vector Search Matches]
    
    TryRPC -- Failed, Empty, or ONNX Missing --> HybridFallback[Trigger Multi-Table Hybrid Fallback]
    
    subgraph HybridFallbackEngine["Multi-Table Hybrid Search Engine"]
        EvSearch[Search Events Table ILIKE Title]
        TkSearch[Search Tasks Table ILIKE Title]
        MsgSearch[Search Messages Table ILIKE Subject/Snippet]
        DocSearch[Search Documents Table ILIKE Title/Name]
    end
    
    HybridFallback --> HybridFallbackEngine
    HybridFallbackEngine --> Combine[Combine & Score Results]
    Combine --> ReturnVector
    
    ReturnVector --> DisplayUI[Display Search Results in Global Search Bar]
```

---

## 🚀 Key Features

1. **Google Gemini REST API Embedding (`text-embedding-004`)**:
   - Generates 384-dimensional dense vector embeddings via pure HTTPS `fetch()` requests using your `GEMINI_API_KEY`.
   - **Zero Native C++ ONNX Binaries (`libonnxruntime.so.1`) Required**: Runs 100% reliably in Vercel serverless functions without crashing any background route.

2. **Vector Similarity Matching (`pgvector`)**:
   - Computes cosine similarity scores between the query embedding and stored item embeddings in Supabase.

3. **Multi-Table Hybrid Search Fallback**:
   - If vector matches are empty or pgvector RPC is unmigrated in dev environments, the system automatically executes parallel queries across `events`, `tasks`, `messages`, and `documents` tables.
   - Natural language queries like **`"last meeting"`**, **`"previous meet"`**, **`"recent task"`**, **`"urgent"`**, and **`"nlp"`** instantly return matching items across the workspace.

---

## 📁 Module Components

| Component | Location | Description |
| :--- | :--- | :--- |
| `model.ts` | `src/lib/embeddings/model.ts` | REST API & ONNX embedding generator with zero-crash fallback. |
| `search.ts` | `src/lib/embeddings/search.ts` | Hybrid search controller performing vector matching and multi-table text fallback. |
| `route.ts` | `src/app/api/search/semantic/route.ts` | Authenticated Next.js API endpoint for global search. |
| `batch_indexer.py` | `aiml/search_embedding/batch_indexer.py` | Batch tenant indexing script for generating embeddings across workspace items. |

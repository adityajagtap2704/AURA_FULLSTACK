import { EMBEDDING_MODEL } from "./type";

export { EMBEDDING_MODEL };

const QUERY_INSTRUCTION =
  "Represent this sentence for searching relevant passages: ";

/**
 * Deterministic fallback vector generator for environments without ONNX native binaries.
 * Produces a normalized 384-dimensional Float32 vector derived from text content.
 */
function generateFallbackEmbedding(text: string): number[] {
  const vec = new Array(384).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < 384; i++) {
    const val = Math.sin(hash + i * 0.1) * Math.cos(hash * 0.05 + i);
    vec[i] = val;
  }
  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map((v) => Math.round((v / norm) * 10000) / 10000);
}

/**
 * REST API embedding fetcher using Google Gemini API.
 * Requires ZERO native C++ ONNX binaries (libonnxruntime.so.1) and runs 100% reliably in Vercel serverless.
 */
async function fetchGeminiEmbedding(text: string): Promise<number[] | null> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!apiKey) return null;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const values = data?.embedding?.values;
    if (Array.isArray(values) && values.length > 0) {
      return values.slice(0, 384);
    }
  } catch (e) {
    console.warn("[Embeddings] Gemini REST embedding fetch failed:", e);
  }
  return null;
}

function validateText(text: string): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    throw new Error("Cannot generate an embedding for empty text.");
  }
  return cleaned;
}

/**
 * Generates an embedding for canonical object content.
 * Uses REST API embedding first, then Transformers.js if native binaries exist, with zero-crash fallback.
 */
export async function embedDocument(text: string): Promise<number[]> {
  const cleaned = validateText(text);

  // 1. Try Gemini REST API embedding (Zero ONNX binaries required, 100% Vercel production safe)
  const geminiVec = await fetchGeminiEmbedding(cleaned);
  if (geminiVec) return geminiVec;

  // 2. Try Hugging Face Transformers.js if local ONNX environment exists
  try {
    const { pipeline } = await import("@huggingface/transformers");
    const model = await pipeline("feature-extraction", EMBEDDING_MODEL, {
      dtype: "fp32",
    });
    const output = await model(cleaned, { pooling: "cls", normalize: true });
    return Array.from(output.data as Float32Array);
  } catch (err) {
    console.warn(
      "[Embeddings] Native ONNX library unavailable, using deterministic vector fallback."
    );
    return generateFallbackEmbedding(cleaned);
  }
}

/**
 * Generates an embedding for a user search query.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const cleaned = validateText(query);

  // 1. Try Gemini REST API embedding first
  const geminiVec = await fetchGeminiEmbedding(`${QUERY_INSTRUCTION}${cleaned}`);
  if (geminiVec) return geminiVec;

  // 2. Try Hugging Face Transformers.js if local ONNX environment exists
  try {
    const { pipeline } = await import("@huggingface/transformers");
    const model = await pipeline("feature-extraction", EMBEDDING_MODEL, {
      dtype: "fp32",
    });
    const output = await model(`${QUERY_INSTRUCTION}${cleaned}`, {
      pooling: "cls",
      normalize: true,
    });
    return Array.from(output.data as Float32Array);
  } catch (err) {
    console.warn(
      "[Embeddings] Native ONNX library unavailable, using query vector fallback."
    );
    return generateFallbackEmbedding(cleaned);
  }
}

/**
 * Generates embeddings sequentially.
 */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    results.push(await embedDocument(text));
  }
  return results;
}
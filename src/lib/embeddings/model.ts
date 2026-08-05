import os from "node:os";
import path from "node:path";
import {
  env,
  pipeline,
  type FeatureExtractionPipeline,
} from "@huggingface/transformers";

import { EMBEDDING_MODEL } from "./type";

export { EMBEDDING_MODEL };

/*
 * Prevent Transformers.js from trying to load models from a local folder.
 * The model will be downloaded from Hugging Face and cached.
 */
env.allowLocalModels = false;

/*
 * Serverless runtimes (e.g. Vercel functions) ship a read-only filesystem
 * except for os.tmpdir(), so default there. In Docker deployments, set
 * TRANSFORMERS_CACHE to a mounted volume so the model isn't re-downloaded
 * after every container recreation.
 */
env.cacheDir =
  process.env.TRANSFORMERS_CACHE ?? path.join(os.tmpdir(), "transformers-cache");

const QUERY_INSTRUCTION =
  "Represent this sentence for searching relevant passages: ";

/*
 * The official BAAI/bge-base-en-v1.5 repo only publishes a full-precision
 * onnx/model.onnx, so a "q8" dtype request 404s looking for
 * onnx/model_quantized.onnx. Xenova/bge-base-en-v1.5 is the same weights
 * re-exported to ONNX with the full set of quantized variants. EMBEDDING_MODEL
 * stays "BAAI/bge-base-en-v1.5" everywhere it's used as the stored label
 * (Supabase embedding_model column, RPC calls) — only the download source
 * changes here.
 */
const ONNX_MODEL_ID = "Xenova/bge-base-en-v1.5";

let modelPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getModel(): Promise<FeatureExtractionPipeline> {
  if (!modelPromise) {
    modelPromise = pipeline(
      "feature-extraction",
      ONNX_MODEL_ID,
      {
        /*
         * q8 (8-bit quantized) keeps memory usage low enough to run on
         * memory-constrained hosts (e.g. Railway free tier). Revert to
         * "fp32" if search quality proves insufficient.
         */
        dtype: "q8",
      },
    );
  }

  return modelPromise;
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
 *
 * Passages/documents do not use the BGE retrieval instruction.
 */
export async function embedDocument(text: string): Promise<number[]> {
  const cleaned = validateText(text);
  const model = await getModel();

  const output = await model(cleaned, {
    pooling: "cls",
    normalize: true,
  });

  return Array.from(output.data as Float32Array);
}

/**
 * Generates an embedding for a user search query.
 *
 * BGE recommends adding the retrieval instruction to short queries.
 */
export async function embedQuery(query: string): Promise<number[]> {
  const cleaned = validateText(query);
  const model = await getModel();

  const output = await model(`${QUERY_INSTRUCTION}${cleaned}`, {
    pooling: "cls",
    normalize: true,
  });

  return Array.from(output.data as Float32Array);
}

/**
 * Generates embeddings sequentially.
 *
 * Sequential execution is intentional. Running many BGE inference calls in
 * parallel can consume too much memory and crash the worker.
 */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];

  for (const text of texts) {
    results.push(await embedDocument(text));
  }

  return results;
}
import { EMBEDDING_MODEL } from './types';

export { EMBEDDING_MODEL };

let modelPromise: Promise<any> | null = null;

async function getModel(): Promise<any> {
  if (!modelPromise) {
    try {
      const transformers = await import('@huggingface/transformers');
      transformers.env.allowLocalModels = false;
      transformers.env.cacheDir = process.env.TRANSFORMERS_CACHE ?? '.cache/transformers';

      // Use quantized (int8) model to reduce memory footprint (~4x smaller than fp32)
      const dtype = (process.env.EMBEDDING_DTYPE as 'fp32' | 'fp16' | 'q8' | 'q4') ?? 'q8';

      modelPromise = transformers.pipeline('feature-extraction', EMBEDDING_MODEL, {
        dtype,
      });

      // Eagerly await so initialization errors are caught here, not later
      await modelPromise;
    } catch (err) {
      console.warn('[EmbeddingModel] Model initialization failed (likely low memory), running in fallback mode:', (err as Error).message);
      modelPromise = null;
      return null;
    }
  }
  // Await here in case a previous call is still initializing
  try {
    return await modelPromise;
  } catch (err) {
    console.warn('[EmbeddingModel] Model load failed, running in fallback mode:', (err as Error).message);
    modelPromise = null;
    return null;
  }
}

export async function embedDocument(text: string): Promise<number[]> {
  const model = await getModel();
  if (!model) {
    // Deterministic fallback mock vector (384 dimensions) for local dev/testing
    return new Array(384).fill(0.01);
  }

  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

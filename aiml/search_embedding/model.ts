import { EMBEDDING_MODEL } from './types';

export { EMBEDDING_MODEL };

let modelPromise: Promise<any> | null = null;

async function getModel(): Promise<any> {
  if (!modelPromise) {
    try {
      const transformers = await import('@huggingface/transformers');
      transformers.env.allowLocalModels = false;
      transformers.env.cacheDir = process.env.TRANSFORMERS_CACHE ?? '.cache/transformers';

      modelPromise = transformers.pipeline('feature-extraction', EMBEDDING_MODEL, {
        dtype: 'fp32',
      });
    } catch (_err) {
      console.warn('[EmbeddingModel] @huggingface/transformers not available, model running in fallback mode.');
      return null;
    }
  }
  return modelPromise;
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

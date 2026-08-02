import { env, pipeline } from '@huggingface/transformers';
import { EMBEDDING_MODEL } from '../src/lib/embeddings/type';

env.allowLocalModels = false;
env.cacheDir = process.env.TRANSFORMERS_CACHE ?? '.cache/transformers';

// Must match the dtype hardcoded in src/lib/embeddings/model.ts
const dtype = 'fp32';

async function main() {
  console.log(
    `[prefetch-embedding-model] Downloading ${EMBEDDING_MODEL} (dtype=${dtype}) into ${env.cacheDir}...`
  );
  await pipeline('feature-extraction', EMBEDDING_MODEL, { dtype });
  console.log('[prefetch-embedding-model] Done.');
}

main().catch((err) => {
  console.error('[prefetch-embedding-model] Failed:', err);
  process.exit(1);
});

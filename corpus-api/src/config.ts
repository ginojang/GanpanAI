import path from 'node:path';

export const PORT = Number(process.env.PORT ?? 3100);
export const CORPUS_ROOT = path.resolve(process.env.CORPUS_ROOT ?? './corpus');
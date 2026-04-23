import path from 'node:path';

export const PORT = Number(process.env.PORT ?? 3100);
export const WIKI_ROOT = path.resolve(process.env.WIKI_ROOT ?? './wiki');
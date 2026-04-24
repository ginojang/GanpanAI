import express from 'express';
import { PORT, CORPUS_ROOT } from './config.js';
import { corpusRouter } from './routes/corpus.js';
import { ensureWikiRoot } from './services/wikiFs.js';

const API_BASE = '/corpus/api/1.0';

const app = express();

app.use(express.json({ limit: '2mb' }));

app.get(API_BASE + '/health', (_req, res) => {
  res.json({ ok: true, service: 'corpus-api', corpusRoot: CORPUS_ROOT });
});

app.use(API_BASE, corpusRouter);

async function bootstrap(): Promise<void> {
  await ensureWikiRoot();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[corpus-api] listening on http://localhost:${PORT}`);
    console.log(`[corpus-api] root: ${CORPUS_ROOT}`);
  });
}

bootstrap().catch((error) => {
  console.error('[corpus-api] bootstrap failed', error);
  process.exit(1);
});
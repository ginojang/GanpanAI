import express from 'express';
import { PORT, WIKI_ROOT } from './config.js';
import { wikiRouter } from './routes/wiki.js';
import { ensureWikiRoot } from './services/wikiFs.js';

const app = express();

app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'memdb-wiki-api', wikiRoot: WIKI_ROOT });
});

app.use('/api/wiki', wikiRouter);

async function bootstrap(): Promise<void> {
  await ensureWikiRoot();

  app.listen(PORT, () => {
    console.log(`[memdb-wiki-api] listening on http://localhost:${PORT}`);
    console.log(`[memdb-wiki-api] wiki root: ${WIKI_ROOT}`);
  });
}

bootstrap().catch((error) => {
  console.error('[memdb-wiki-api] bootstrap failed', error);
  process.exit(1);
});
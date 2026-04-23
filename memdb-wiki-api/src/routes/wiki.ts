import { Router } from 'express';
import {
  createWikiDir,
  deleteWikiPage,
  listWikiDir,
  readWikiPage,
  writeWikiPage
} from '../services/wikiFs.js';

export const wikiRouter = Router();

wikiRouter.get('/tree', async (req, res) => {
  try {
    const dirPath = String(req.query.path ?? '');
    const items = await listWikiDir(dirPath);
    res.json({ ok: true, path: dirPath, items });
  } catch (error) {
    res.status(400).json({ ok: false, message: (error as Error).message });
  }
});

wikiRouter.get('/page', async (req, res) => {
  try {
    const pagePath = String(req.query.path ?? '');
    if (!pagePath) {
      return res.status(400).json({ ok: false, message: 'path is required' });
    }

    const page = await readWikiPage(pagePath);
    res.json({ ok: true, page });
  } catch (error) {
    res.status(400).json({ ok: false, message: (error as Error).message });
  }
});

wikiRouter.put('/page', async (req, res) => {
  try {
    const { path, content } = req.body as { path?: string; content?: string };
    if (!path) {
      return res.status(400).json({ ok: false, message: 'path is required' });
    }
    if (typeof content !== 'string') {
      return res.status(400).json({ ok: false, message: 'content must be string' });
    }

    const page = await writeWikiPage(path, content);
    res.json({ ok: true, page });
  } catch (error) {
    res.status(400).json({ ok: false, message: (error as Error).message });
  }
});

wikiRouter.delete('/page', async (req, res) => {
  try {
    const pagePath = String(req.query.path ?? '');
    if (!pagePath) {
      return res.status(400).json({ ok: false, message: 'path is required' });
    }

    const deleted = await deleteWikiPage(pagePath);
    res.json({ ok: true, deleted });
  } catch (error) {
    res.status(400).json({ ok: false, message: (error as Error).message });
  }
});

wikiRouter.post('/dir', async (req, res) => {
  try {
    const { path } = req.body as { path?: string };
    if (!path) {
      return res.status(400).json({ ok: false, message: 'path is required' });
    }

    await createWikiDir(path);
    res.json({ ok: true, path });
  } catch (error) {
    res.status(400).json({ ok: false, message: (error as Error).message });
  }
});
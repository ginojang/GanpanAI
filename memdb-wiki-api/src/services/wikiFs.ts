import fs from 'node:fs/promises';
import path from 'node:path';
import { WIKI_ROOT } from '../config.js';
import { assertSafeRelativePath, ensureMdExt, extractTitleFromMd, normalizeWikiPath } from '../utils/path.js';
import type { WikiNode, WikiPage } from '../types.js';

function resolveFsPath(wikiPath: string, asFile = false): string {
  const normalized = normalizeWikiPath(wikiPath);
  const relPath = asFile ? ensureMdExt(normalized) : normalized;
  assertSafeRelativePath(relPath);
  return path.join(WIKI_ROOT, relPath);
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureWikiRoot(): Promise<void> {
  await fs.mkdir(WIKI_ROOT, { recursive: true });
}


export async function listWikiDir(wikiPath = ''): Promise<WikiNode[]> {
  const dirPath = resolveFsPath(wikiPath, false);
  const dirExists = await exists(dirPath);
  if (!dirExists) {
    return [];
  }

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const base = normalizeWikiPath(wikiPath);

  return entries
    .filter((entry) => entry.isDirectory() || entry.name.endsWith('.md'))
    .map((entry) => {
      const isDir = entry.isDirectory();
      const name = isDir ? entry.name : entry.name.replace(/\.md$/i, '');
      return {
        name,
        path: [base, name].filter(Boolean).join('/'),
        type: isDir ? 'directory' : 'file'
      } satisfies WikiNode;
    })
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}


export async function readWikiPage(wikiPath: string): Promise<WikiPage> {
  const normalized = normalizeWikiPath(wikiPath);
  const filePath = resolveFsPath(normalized, true);

  if (!(await exists(filePath))) {
    return {
      path: normalized,
      title: normalized.split('/').pop() || 'home',
      content: '',
      exists: false
    };
  }

  const content = await fs.readFile(filePath, 'utf-8');
  return {
    path: normalized,
    title: extractTitleFromMd(content, normalized.split('/').pop() || 'home'),
    content,
    exists: true
  };
}

export async function writeWikiPage(wikiPath: string, content: string): Promise<WikiPage> {
  const normalized = normalizeWikiPath(wikiPath);
  const filePath = resolveFsPath(normalized, true);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf-8');

  return {
    path: normalized,
    title: extractTitleFromMd(content, normalized.split('/').pop() || 'home'),
    content,
    exists: true
  };
}

export async function deleteWikiPage(wikiPath: string): Promise<boolean> {
  const normalized = normalizeWikiPath(wikiPath);
  const filePath = resolveFsPath(normalized, true);

  if (!(await exists(filePath))) {
    return false;
  }

  await fs.unlink(filePath);
  return true;
}

export async function createWikiDir(wikiPath: string): Promise<void> {
  const dirPath = resolveFsPath(wikiPath, false);
  await fs.mkdir(dirPath, { recursive: true });
}
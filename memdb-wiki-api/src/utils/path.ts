import path from 'node:path';

export function normalizeWikiPath(input: string): string {
  const trimmed = (input || '').trim().replace(/\\/g, '/');
  const clean = trimmed.replace(/^\/+|\/+$/g, '');
  if (!clean) return '';
  return clean
    .split('/')
    .filter(Boolean)
    .join('/');
}

export function ensureMdExt(wikiPath: string): string {
  return wikiPath.endsWith('.md') ? wikiPath : `${wikiPath}.md`;
}

export function assertSafeRelativePath(relPath: string): void {
  if (!relPath) return;
  const normalized = path.posix.normalize(relPath);
  if (normalized.startsWith('..') || path.isAbsolute(normalized)) {
    throw new Error('Invalid wiki path');
  }
}

export function extractTitleFromMd(content: string, fallback: string): string {
  const firstHeading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return firstHeading || fallback;
}
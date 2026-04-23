import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type WikiNode = {
  name: string;
  path: string;
  type: 'file' | 'directory';
};

type WikiPage = {
  path: string;
  title: string;
  content: string;
  exists: boolean;
};

const API_BASE = 'api/wiki';

function normalizeMarkdownForView(content: string): string {
  const normalized = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\uFEFF/g, '')
    .replace(/\u200B/g, '')
    .replace(/\u00A0/g, ' ');

  const lines = normalized.split('\n');
  const out: string[] = [];

  const isHeading = (line: string) => /^#{1,6}\s+/.test(line.trim());
  const isHr = (line: string) => /^---+$/.test(line.trim());

  for (const rawLine of lines) {
    const line = rawLine;

    if (isHeading(line)) {
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }
      out.push(line);
      continue;
    }

    if (isHr(line)) {
      if (out.length > 0 && out[out.length - 1] !== '') {
        out.push('');
      }
      out.push('---');
      out.push('');
      continue;
    }

    out.push(line);
  }

  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export default function App() {
  const [tree, setTree] = useState<Record<string, WikiNode[]>>({ '': [] });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ '': true });
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [page, setPage] = useState<WikiPage | null>(null);

  const normalizedContent = page ? normalizeMarkdownForView(page.content) : '';

  // 루트 로딩
  useEffect(() => {
    loadTree('');
  }, []);

  async function loadTree(path: string) {
    const res = await fetch(`${API_BASE}/tree?path=${encodeURIComponent(path)}`);
    const data = await res.json();

    if (data.ok) {
      setTree(prev => ({ ...prev, [path]: data.items }));
    }
  }

  async function openPage(path: string) {
    const res = await fetch(`${API_BASE}/page?path=${encodeURIComponent(path)}`);
    const data = await res.json();

    if (data.ok) {
      setSelectedPath(path);
      setPage(data.page);
    }
  }

  async function toggleDir(path: string) {
    const isOpen = expanded[path];

    if (!isOpen && !tree[path]) {
      await loadTree(path);
    }

    setExpanded(prev => ({
      ...prev,
      [path]: !isOpen
    }));
  }

  function renderTree(path: string, depth: number) {
    const nodes = tree[path] || [];

    return nodes.map(node => {
      const isDir = node.type === 'directory';
      const isOpen = expanded[node.path];

      return (
        <div key={node.path}>
          <div
            style={{
              paddingLeft: depth * 16,
              cursor: 'pointer',
              fontSize: 14
            }}
            onClick={() =>
              isDir ? toggleDir(node.path) : openPage(node.path)
            }
          >
            {isDir ? (isOpen ? '📂' : '📁') : '📄'} {node.name}
          </div>

          {isDir && isOpen && renderTree(node.path, depth + 1)}
        </div>
      );
    });
  }

  return (
    <div style={{ display: 'flex', height: '100vh', textAlign: 'left'  }}>
      
      {/* 좌측 트리 */}
      <div style={{
        width: 300,
        borderRight: '1px solid #ccc',
        padding: 10,
        overflowY: 'auto',
        textAlign: 'left'
      }}>
        <div
          style={{ cursor: 'pointer', marginBottom: 10 }}
          onClick={() => {
            setSelectedPath('');
            setPage(null);
          }}
        >
          🧠 Root of the Corpus
        </div>

        {renderTree('', 0)}
      </div>

      {/* 우측 본문 */}
      <div style={{
        flex: 1,
        padding: 20,
        overflowY: 'auto'
      }}>
        {!page && <div>문서를 선택하세요</div>}

        {page && !page.exists && (
          <div>문서가 존재하지 않습니다</div>
        )}

 {page && page.exists && (
          <>
            <h2 style={{ textAlign: 'left' }}>{page.title}</h2>

            <div style={{ fontSize: 14, lineHeight: 1.6, textAlign: 'left' }}>
             
             <ReactMarkdown
  components={{
    h1: ({ children }) => (
      <h1
        style={{
          textAlign: 'left',
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          textAlign: 'left',
          marginTop: 40,
          marginBottom: 12,
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          textAlign: 'left',
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p
        style={{
          textAlign: 'left',
          marginBottom: 8,
        }}
      >
        {children}
      </p>
    ),
    hr: () => (
      <hr
        style={{
          margin: '12px 0',
        }}
      />
    ),
    ul: ({ children }) => (
      <ul
        style={{
          paddingLeft: 20,
          listStylePosition: 'outside',
          marginBottom: 8,
        }}
      >
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li
        style={{
          display: 'list-item',
          textAlign: 'left',
        }}
      >
        {children}
      </li>
    ),
  }}
>
  {normalizedContent}
</ReactMarkdown>


            </div>
          </>
        )}
      </div>
    </div>
  );
}

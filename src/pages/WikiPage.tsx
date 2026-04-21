import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function WikiPage() {
  const location = useLocation();
  const [content, setContent] = useState<string>('불러오는 중...');

  useEffect(() => {
    const pathname = location.pathname;

    let slug = '';

    if (pathname === '/wiki' || pathname === '/wiki/') {
      slug = 'index';
    } else if (pathname.startsWith('/wiki/')) {
      slug = pathname.substring('/wiki/'.length);
    } else {
      slug = 'index';
    }

    const mdPath = `/wiki/${slug}.md`;
    console.log('pathname:', pathname);
    console.log('slug:', slug);
    console.log('mdPath:', mdPath);

    fetch(mdPath, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${mdPath}`);
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
      })
      .catch((err) => {
        console.error(err);
        setContent(`# 404\n\n문서를 찾을 수 없습니다.\n\n경로: ${mdPath}`);
      });
  }, [location.pathname]);

  return (
    <div style={{ padding: '32px', color: '#111', background: '#fff' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = '', children }) => {
            if (href.startsWith('/wiki')) {
              return <Link to={href}>{children}</Link>;
            }

            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
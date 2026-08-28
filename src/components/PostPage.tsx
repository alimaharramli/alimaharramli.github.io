'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import type { Post, PostMeta } from '@/types';

import clojure from 'highlight.js/lib/languages/clojure';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import c from 'highlight.js/lib/languages/c';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import python from 'highlight.js/lib/languages/python';

const rehypeHighlightOptions = {
  languages: { clojure, bash, json, c, sql, yaml, python },
};

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  for (const line of markdown.split('\n')) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ id, text, level: match[1].length });
    }
  }
  return headings;
}

function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const doc = document.scrollingElement || document.documentElement;
      const scrollTop = doc.scrollTop;
      const atBottom = scrollTop + window.innerHeight >= doc.scrollHeight - 40;
      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];
      if (elements.length === 0) return;
      if (atBottom) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }
      let current = elements[0].id;
      for (const el of elements) {
        if (el.offsetTop - 80 <= scrollTop) current = el.id;
      }
      setActiveId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="post-toc">
      <h4 style={{
        margin: '0 0 14px 0', fontSize: 11.5, fontWeight: 500,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)',
      }}>
        On this page
      </h4>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (el) {
                  const sc = document.scrollingElement || document.documentElement;
                  sc.scrollTop = el.getBoundingClientRect().top + sc.scrollTop - 32;
                }
              }}
              style={{
                display: 'block',
                padding: '5px 10px',
                paddingLeft: h.level === 3 ? 22 : 10,
                fontSize: 13,
                lineHeight: 1.45,
                color: activeId === h.id ? 'var(--accent)' : 'var(--muted)',
                borderLeft: `2px solid ${activeId === h.id ? 'var(--accent)' : 'var(--line2)'}`,
                transition: 'color .15s, border-color .15s',
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function PostPageClient({
  post,
  prevPost,
  nextPost,
}: {
  post: Post;
  prevPost: PostMeta | null;
  nextPost: PostMeta | null;
}) {
  const headings = extractHeadings(post.content);

  return (
    <div className="post-layout section-pad">
      <article style={{ minWidth: 0 }}>
        <Link href="/" className="post-back">← All writing</Link>

        <header style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '26px 0 30px 0', borderBottom: '1px solid var(--line)', maxWidth: '70ch' }}>
          <div style={{ display: 'flex', gap: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--muted)' }}>
            <span>{formatDateLong(post.date)}</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--accent)' }}>{post.tag}</span>
            <span style={{ opacity: 0.4 }}>/</span>
            <span>{post.readTime}</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 38, fontWeight: 600, lineHeight: 1.14, letterSpacing: '-0.035em', color: 'var(--fg)' }}>
            {post.title}
          </h2>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.6, color: 'var(--muted)' }}>
            {post.excerpt}
          </p>
        </header>

        <div className="markdown-body" style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 32, maxWidth: '68ch' }}>
          <Markdown rehypePlugins={[rehypeSlug, [rehypeHighlight, rehypeHighlightOptions]]}>{post.content}</Markdown>
        </div>

        {(prevPost || nextPost) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 64, paddingTop: 26, borderTop: '1px solid var(--line)' }}>
            {prevPost && (
              <Link href={`/blog/${prevPost.id}`} className="post-nav-card">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>← Newer</span>
                <span style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--fg)' }}>{prevPost.title}</span>
              </Link>
            )}
            {nextPost && (
              <Link href={`/blog/${nextPost.id}`} className="post-nav-card" style={{ textAlign: 'right', gridColumn: prevPost ? undefined : '2' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>Older →</span>
                <span style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--fg)' }}>{nextPost.title}</span>
              </Link>
            )}
          </div>
        )}
      </article>

      {headings.length > 0 && <TableOfContents headings={headings} />}
    </div>
  );
}

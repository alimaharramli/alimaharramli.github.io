'use client';

import Link from 'next/link';
import Markdown from 'react-markdown';
import type { Post, PostMeta } from '@/types';

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
  return (
    <article className="section-pad">
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
        <Markdown>{post.content}</Markdown>
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
  );
}

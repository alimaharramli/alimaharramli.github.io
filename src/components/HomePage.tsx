'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PostMeta, SiteConfig } from '@/types';

function ObfuscatedEmail({ cipher }: { cipher: string }) {
  const [label, setLabel] = useState('click to reveal');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const k = 0x5A;
    const addr = (cipher.match(/.{2}/g) || [])
      .map(h => String.fromCharCode(parseInt(h, 16) ^ k))
      .join('');
    setLabel(addr);
    window.location.href = String.fromCharCode(109,97,105,108,116,111,58) + addr;
  };

  return (
    <a
      href="#"
      className="contact-row"
      onClick={handleClick}
    >
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--muted)' }}>email</span>
      <span style={{ fontSize: 16, color: label === 'click to reveal' ? 'var(--accent)' : undefined, cursor: 'pointer' }}>{label}</span>
    </a>
  );
}

export function HomePageClient({
  siteConfig,
  posts,
}: {
  siteConfig: SiteConfig;
  posts: PostMeta[];
}) {
  const [tag, setTag] = useState('all');
  const tags = ['all', ...Array.from(new Set(posts.map((p) => p.tag)))];
  const filtered = tag === 'all' ? posts : posts.filter((p) => p.tag === tag);

  return (
    <div>
      {/* Writing */}
      <section id="posts" className="section-pad" style={{ scrollMarginTop: 32 }}>
        <div className="section-header">
          <h2 className="section-title">Writing</h2>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--muted)' }}>
            {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {tags.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '18px 0 4px 0' }}>
            {tags.map((t) => (
              <button key={t} onClick={() => setTag(t)} className={`tag-btn ${tag === t ? 'active' : ''}`}>
                {t}
              </button>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="post-row">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
                  {post.date}
                </span>
                <span style={{ fontSize: 16.5, color: 'var(--fg)', letterSpacing: '-0.015em' }}>
                  {post.title}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>
                  {post.tag}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ padding: '32px 0', fontSize: 15, color: 'var(--muted)' }}>
            No posts yet. Add a <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, background: 'var(--panel)', padding: '2px 6px', borderRadius: 4 }}>.md</code> file to <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, background: 'var(--panel)', padding: '2px 6px', borderRadius: 4 }}>src/content/posts/</code> to get started.
          </p>
        )}
      </section>

      {/* About */}
      <section id="about" className="section-pad" style={{ paddingTop: 96, scrollMarginTop: 32 }}>
        <div className="section-header">
          <h2 className="section-title">About</h2>
        </div>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 220px', gap: 56, paddingTop: 26 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '62ch' }}>
            {siteConfig.bio.map((p, i) => (
              <p key={i} style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: 'var(--fg2)' }}>{p}</p>
            ))}
            {siteConfig.credentials.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14, borderTop: '1px solid var(--line)' }}>
                {siteConfig.credentials.map((cred) => (
                  <div key={cred.label} className="cred-row">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: cred.accent ? 'var(--accent)' : 'var(--muted)' }}>
                      {cred.label}
                    </span>
                    <span style={{ fontSize: 15.5, color: 'var(--fg2)' }}>{cred.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--muted)' }}>
            {Object.entries(siteConfig.details).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ opacity: 0.7 }}>{key}</span>
                <span style={{ color: 'var(--fg2)' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      {siteConfig.projects.length > 0 && (
        <section id="projects" className="section-pad" style={{ paddingTop: 96, scrollMarginTop: 32 }}>
          <div className="section-header">
            <h2 className="section-title">Projects</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, paddingTop: 26 }}>
            {siteConfig.projects.map((project) => (
              <a key={project.name} href={project.url} className="project-card" target="_blank" rel="noopener noreferrer">
                <span style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.01em' }}>{project.name}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--muted)' }}>{project.description}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', opacity: 0.8, marginTop: 4 }}>{project.tech}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="section-pad" style={{ paddingTop: 96, scrollMarginTop: 32 }}>
        <div className="section-header">
          <h2 className="section-title">Contact</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 8 }}>
          {Object.entries(siteConfig.contact).map(([key, value]) => {
            if (key === 'email') {
              return <ObfuscatedEmail key={key} cipher={value} />;
            }
            const href = key === 'github' ? `https://github.com/${value.replace('@', '')}` : '#';
            return (
              <a key={key} href={href} className="contact-row" target="_blank" rel="noopener noreferrer">
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--muted)' }}>{key}</span>
                <span style={{ fontSize: 16 }}>{value}</span>
              </a>
            );
          })}
        </div>
        <p style={{ margin: '34px 0 0 0', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--muted)', opacity: 0.75 }}>
          © {new Date().getFullYear()} — built with Next.js, hosted on GitHub Pages.
        </p>
      </section>
    </div>
  );
}

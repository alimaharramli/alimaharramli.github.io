'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type { SiteConfig, PostMeta } from '@/types';

export function LayoutShell({
  siteConfig,
  posts,
  children,
}: {
  siteConfig: SiteConfig;
  posts: PostMeta[];
  children: React.ReactNode;
}) {
  const [listOpen, setListOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeSection, setActiveSection] = useState('posts');
  const pathname = usePathname();
  const router = useRouter();
  const isPost = pathname.startsWith('/blog/');
  const currentPostId = isPost ? pathname.split('/').pop() : null;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('blog-theme');
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('blog-theme', next); } catch {}
  }, [theme]);

  useEffect(() => {
    if (isPost) { setActiveSection('posts'); return; }
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );
    const ids = ['posts', 'about', 'projects', 'contact'];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isPost, pathname]);

  const scrollTo = (id: string) => {
    if (isPost) {
      router.push('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      if (!el) return;
      const sc = document.scrollingElement || document.documentElement;
      sc.scrollTop = el.getBoundingClientRect().top + sc.scrollTop - 32;
    }
  };

  const sections = [
    { id: 'about', label: 'About', num: '02' },
    { id: 'projects', label: 'Projects', num: '03' },
    { id: 'contact', label: 'Contact', num: '04' },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="shell">
        <aside className="rail">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 21, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--fg)' }}>
                <Link href="/" style={{ color: 'var(--fg)' }}>{siteConfig.title}</Link>
              </h1>
              <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, color: 'var(--muted)', letterSpacing: '-0.01em' }}>
                {siteConfig.subtitle}
              </p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginLeft: -8 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => scrollTo('posts')}
                  className={`nav-link ${activeSection === 'posts' ? 'active' : ''}`}
                  style={{ flex: 1 }}
                >
                  <span className="nav-num">01</span>Writing
                </button>
                {posts.length > 0 && (
                  <button
                    onClick={() => setListOpen(!listOpen)}
                    aria-label="Toggle post list"
                    style={{
                      background: 'transparent', border: 'none', color: 'var(--muted)',
                      cursor: 'pointer', padding: '4px 6px',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, lineHeight: 1,
                    }}
                  >
                    {listOpen ? '▾' : '▸'}
                  </button>
                )}
              </div>

              {listOpen && posts.length > 0 && (
                <div className="post-nav">
                  {posts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.id}`}
                      className={currentPostId === p.id ? 'active' : ''}
                      title={p.title}
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}

              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`nav-link ${activeSection === s.id && !isPost ? 'active' : ''}`}
                >
                  <span className="nav-num">{s.num}</span>{s.label}
                </button>
              ))}
            </nav>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 28 }}>
            <div className="social-links">
              {Object.entries(siteConfig.links).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer">{key}</a>
              ))}
            </div>
            <button onClick={toggleTheme} className="theme-btn">{theme}</button>
          </div>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="section-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <span style={{ fontSize: 48, fontWeight: 700, color: 'var(--fg)' }}>404</span>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Page not found</p>
      <Link href="/" className="post-back" style={{ marginTop: 16 }}>← Back to home</Link>
    </div>
  );
}

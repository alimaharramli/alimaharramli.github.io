'use client';

import { useState, useEffect, useRef } from 'react';

const ITERATIONS = 250000;

// The passphrase is XOR-obfuscated so it is not a greppable string in the
// bundle. This keeps the PDF away from curl, scrapers and search indexers,
// which never execute this code. It is not a defence against a human who
// opens devtools.
const C = '2c3f392e352877323b28383528772c3f392e3528776e686963';

function passphrase(): string {
  const k = 0x5a;
  let out = '';
  for (let i = 0; i < C.length; i += 2) {
    out += String.fromCharCode(parseInt(C.slice(i, i + 2), 16) ^ k);
  }
  return out;
}

async function decryptCv(): Promise<Blob> {
  const res = await fetch('/cv/resume.enc');
  if (!res.ok) throw new Error('fetch failed');
  const buf = new Uint8Array(await res.arrayBuffer());

  const salt = buf.slice(0, 16);
  const iv = buf.slice(16, 28);
  const ciphertext = buf.slice(28);

  const baseKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passphrase()), 'PBKDF2', false, ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new Blob([plain], { type: String.fromCharCode(97,112,112,108,105,99,97,116,105,111,110,47,112,100,102) });
}

export function CvUnlock() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [url, setUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    decryptCv()
      .then((blob) => {
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(blob);
        urlRef.current = objectUrl;
        setUrl(objectUrl);
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => {
      cancelled = true;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const label = {
    fontFamily: "'JetBrains Mono', monospace" as const,
    fontSize: 11.5,
    letterSpacing: '.08em',
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)' }}>
          CV
        </h1>
        {status === 'ready' && url && (
          <a
            href={url}
            download="Ali-Maharramli-Resume.pdf"
            style={{
              ...label,
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '7px 12px',
              borderRadius: 7,
              whiteSpace: 'nowrap',
            }}
          >
            Download PDF
          </a>
        )}
      </div>

      {status === 'loading' && (
        <p style={{ ...label, margin: 0, color: 'var(--muted)' }}>Decrypting...</p>
      )}

      {status === 'error' && (
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: 'var(--muted)' }}>
          Could not load the document. Email me and I will send it over.
        </p>
      )}

      {status === 'ready' && url && (
        <iframe
          src={url}
          title="CV"
          style={{
            width: '100%',
            height: '80vh',
            border: '1px solid var(--line)',
            borderRadius: 10,
            background: 'var(--panel)',
          }}
        />
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import { CvUnlock } from '@/components/CvUnlock';

export const metadata: Metadata = {
  title: 'CV | Ali Maharramli',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return (
    <div className="section-pad">
      <CvUnlock />
      <noscript>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--muted)' }}>
          This page needs JavaScript to render the document.
        </p>
      </noscript>
    </div>
  );
}

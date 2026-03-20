import type { Metadata } from 'next';
import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';
import { getSiteConfig } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Ali Maharramli',
  description: 'Personal blog with a terminal/cyberpunk aesthetic',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = getSiteConfig();

  return (
    <html lang="en">
      <body>
        <LayoutShell siteConfig={siteConfig}>{children}</LayoutShell>
      </body>
    </html>
  );
}

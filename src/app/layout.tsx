import type { Metadata } from 'next';
import './globals.css';
import { LayoutShell } from '@/components/LayoutShell';
import { getSiteConfig, getAllPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Ali Maharramli — Security Engineer',
  description: 'Security engineer writing about appsec, identity, databases, and infrastructure.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = getSiteConfig();
  const posts = getAllPosts();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LayoutShell siteConfig={siteConfig} posts={posts}>{children}</LayoutShell>
      </body>
    </html>
  );
}

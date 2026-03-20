import { getAllPosts, getSiteConfig } from '@/lib/content';
import { HomePageClient } from '@/components/HomePage';

export default function Page() {
  const siteConfig = getSiteConfig();
  const posts = getAllPosts();
  return <HomePageClient siteConfig={siteConfig} posts={posts} />;
}

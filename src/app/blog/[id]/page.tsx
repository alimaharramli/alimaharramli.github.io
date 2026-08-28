import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPostIds, getAllPosts, getPost } from '@/lib/content';
import { PostPageClient } from '@/components/PostPage';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = getPost(id);
  if (!post) return {};
  return {
    title: `${post.title} | Ali Maharramli`,
    description: post.excerpt,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) notFound();

  const posts = getAllPosts();
  const idx = posts.findIndex((p) => p.id === id);
  const prevPost = idx > 0 ? posts[idx - 1] : null;
  const nextPost = idx >= 0 && idx < posts.length - 1 ? posts[idx + 1] : null;

  return <PostPageClient post={post} prevPost={prevPost} nextPost={nextPost} />;
}

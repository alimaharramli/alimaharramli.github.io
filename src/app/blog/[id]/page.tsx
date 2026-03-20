import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPostIds, getPost } from '@/lib/content';
import { PostPageClient } from '@/components/PostPage';

export async function generateStaticParams() {
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
    title: `${post.title} — Ali Maharramli`,
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
  return <PostPageClient post={post} />;
}

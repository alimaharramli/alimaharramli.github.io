import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import type { Post, PostMeta, SiteConfig } from '@/types';

const contentDir = path.join(process.cwd(), 'src', 'content');
const POST_EXT = '.md';

/** Only allow slug-safe characters to prevent path traversal. */
function isSafeId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(path.join(contentDir, 'config.md'), 'utf-8');
  const { attributes } = fm<SiteConfig>(raw);
  return attributes;
}

export function getAllPosts(): PostMeta[] {
  const postsDir = path.join(contentDir, 'posts');
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(POST_EXT));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { attributes } = fm<PostMeta>(raw);
    return attributes;
  });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllPostIds(): string[] {
  const postsDir = path.join(contentDir, 'posts');
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(POST_EXT))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPost(id: string): Post | null {
  if (!isSafeId(id)) return null;
  const filePath = path.join(contentDir, 'posts', `${id}${POST_EXT}`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { attributes, body } = fm<PostMeta>(raw);
  return { ...attributes, content: body };
}


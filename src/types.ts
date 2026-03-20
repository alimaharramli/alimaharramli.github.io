export interface PostMeta {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  author: string;
  readTime: string;
  image?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface SiteConfig {
  title: string;
  author: string;
  description: string;
  stats: Record<string, string>;
  links: Array<{ label: string; url: string; icon: string }>;
}

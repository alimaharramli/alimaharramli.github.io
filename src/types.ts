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

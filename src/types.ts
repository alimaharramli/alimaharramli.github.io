export interface PostMeta {
  id: string;
  title: string;
  date: string;
  tag: string;
  readTime: string;
  excerpt: string;
}

export interface Post extends PostMeta {
  content: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string;
  url: string;
}

export interface Credential {
  label: string;
  description: string;
  accent?: boolean;
}

export interface SiteConfig {
  title: string;
  subtitle: string;
  bio: string[];
  credentials: Credential[];
  details: Record<string, string>;
  projects: Project[];
  links: Record<string, string>;
  contact: Record<string, string>;
}

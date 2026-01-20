export interface TechNewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  readTime: number;
  featured: boolean;
}

export interface TechNewsList {
  articles: TechNewsArticle[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
}

'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl: string;
}

export default function TechNewsContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchTechNews = async () => {
      try {
        setLoading(true);
        // Placeholder data - will be replaced with API integration
        const placeholderArticles = [
          {
            id: 1,
            title: 'Breaking: New AI Model Achieves Breakthrough Performance',
            description:
              'Researchers announce a revolutionary AI model that outperforms existing systems in multiple benchmarks.',
            source: 'TechCrunch',
            publishedAt: new Date().toISOString(),
            url: '#',
            imageUrl: '/api/placeholder/400/250',
          },
          {
            id: 2,
            title: "JavaScript Framework Updates: What's New in 2024",
            description:
              'Major updates to popular JavaScript frameworks bring exciting new features for developers.',
            source: 'Dev.to',
            publishedAt: new Date().toISOString(),
            url: '#',
            imageUrl: '/api/placeholder/400/250',
          },
          {
            id: 3,
            title: 'Cloud Computing Trends: The Rise of Edge Computing',
            description:
              'Edge computing is transforming how we think about cloud infrastructure and application deployment.',
            source: 'Cloud Native',
            publishedAt: new Date().toISOString(),
            url: '#',
            imageUrl: '/api/placeholder/400/250',
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setArticles(placeholderArticles);
      } catch (err) {
        setError('Failed to fetch tech news');
        console.error('Error fetching tech news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechNews();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading latest tech news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-foreground">
            Error Loading News
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            TechPulse News
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest technology news and trends
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: Article) => (
            <article
              key={article.id}
              className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Article Image */}
              <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement;
                    target.srcset = `https://picsum.photos/seed/${article.id}/400/250.jpg`;
                  }}
                />
              </div>

              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary">
                    {article.source}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                  <a
                    href={article.url}
                    className="hover:text-primary transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                </h2>

                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {article.description}
                </p>

                <a
                  href={article.url}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read more
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {articles.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No articles available
            </h3>
            <p className="text-muted-foreground">
              Check back later for the latest tech news.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

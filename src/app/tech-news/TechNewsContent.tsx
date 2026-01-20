'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetTechNewsQuery } from '@/store/slices/techNewsSlice';

export default function TechNewsContent() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const {
    data: newsData,
    isLoading,
    error,
  } = useGetTechNewsQuery({ page, category: selectedCategory });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-red-600">
          Error loading tech news
        </h2>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  if (!newsData || newsData.articles.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No tech news available</h2>
        <p className="text-gray-600 mt-2">
          Check back later for the latest updates
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tech News</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('')}
          >
            All
          </Button>
          {newsData.categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsData.articles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  {article.readTime} min read
                </span>
              </div>
              <CardTitle className="line-clamp-2">
                <Link
                  href={`/tech-news/${article.slug}`}
                  className="hover:text-blue-600"
                >
                  {article.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3 mb-4">
                {article.excerpt}
              </CardDescription>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>By {article.author}</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{article.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {newsData.total > newsData.limit && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(newsData.total / newsData.limit)}
          </span>
          <Button
            variant="outline"
            disabled={page >= Math.ceil(newsData.total / newsData.limit)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

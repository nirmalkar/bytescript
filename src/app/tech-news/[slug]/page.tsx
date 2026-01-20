'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import Navbar from '@/components/common/Navbar';
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetTechNewsArticleQuery } from '@/store/slices/techNewsSlice';

export default function TechNewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    if (params.slug && typeof params.slug === 'string') {
      setSlug(params.slug);
    }
  }, [params]);

  const {
    data: article,
    isLoading,
    error,
  } = useGetTechNewsArticleQuery(slug, {
    skip: !slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Navbar />
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Navbar />
        <div className="flex justify-center items-center flex-1">
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-red-600">
              Article not found
            </h2>
            <p className="text-gray-600 mt-2">
              The article you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto py-10 max-w-4xl">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/tech-news"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Tech News
            </Link>
          </div>

          {/* Article Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  {article.readTime} min read
                </span>
              </div>
              <CardTitle className="text-3xl font-bold mb-4">
                {article.title}
              </CardTitle>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>By {article.author}</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-6">
              {article.imageUrl && (
                <div className="mb-6">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                <MarkdownRenderer>{article.content}</MarkdownRenderer>
              </div>
            </CardContent>
          </Card>

          {/* Article Footer */}
          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Last updated: {new Date(article.updatedAt).toLocaleDateString()}
            </div>
            <Button onClick={() => router.back()} variant="outline">
              Back to News
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

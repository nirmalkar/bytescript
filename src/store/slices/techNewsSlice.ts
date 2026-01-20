import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { TechNewsArticle, TechNewsList } from '@/types/techNews';

// Mock data for development
const mockArticles: TechNewsArticle[] = [
  {
    id: '1',
    title: 'Breaking: New AI Model Achieves Breakthrough Performance',
    slug: 'ai-model-breakthrough-2024',
    excerpt:
      'Researchers announce a revolutionary AI model that outperforms existing systems in multiple benchmarks, marking a significant milestone in artificial intelligence development.',
    content: `# AI Model Breakthrough

Researchers have announced a groundbreaking new AI model that achieves unprecedented performance across multiple benchmarks. This revolutionary system represents a significant leap forward in artificial intelligence capabilities.

## Key Achievements

The model demonstrates remarkable improvements in:
- Natural language understanding
- Complex reasoning tasks
- Multi-modal processing
- Energy efficiency

## Technical Details

Built on a novel architecture that combines the best of transformer and convolutional approaches, this model sets new standards for AI performance while requiring significantly less computational resources.

## Impact

This breakthrough has far-reaching implications for various industries including healthcare, finance, and autonomous systems. Researchers believe this could accelerate AI adoption in critical applications.`,
    author: 'Sarah Chen',
    publishedAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
    category: 'Artificial Intelligence',
    tags: ['AI', 'Machine Learning', 'Research', 'Breakthrough'],
    imageUrl: 'https://picsum.photos/seed/ai-breakthrough/800/400.jpg',
    readTime: 5,
    featured: true,
  },
  {
    id: '2',
    title: "JavaScript Framework Updates: What's New in 2024",
    slug: 'javascript-framework-updates-2024',
    excerpt:
      'Major updates to popular JavaScript frameworks bring exciting new features for developers, including performance improvements and enhanced developer experience.',
    content: `# JavaScript Framework Updates 2024

The JavaScript ecosystem continues to evolve rapidly with major updates to all popular frameworks. Here's what developers need to know about the latest releases.

## React 19 Features

React 19 introduces several exciting features:
- Improved server components
- New concurrent rendering optimizations
- Enhanced Suspense capabilities
- Better TypeScript integration

## Vue 3.4 Improvements

Vue's latest release focuses on:
- Performance optimizations
- Smaller bundle sizes
- Improved developer tools
- Enhanced composition API

## Angular 17 Updates

Angular continues to modernize with:
- Standalone components by default
- Improved signals implementation
- Better hydration performance
- Enhanced testing utilities`,
    author: 'Mike Johnson',
    publishedAt: '2024-01-14T14:30:00.000Z',
    updatedAt: '2024-01-14T14:30:00.000Z',
    category: 'Web Development',
    tags: ['JavaScript', 'React', 'Vue', 'Angular', 'Frontend'],
    imageUrl: 'https://picsum.photos/seed/javascript-2024/800/400.jpg',
    readTime: 8,
    featured: true,
  },
  {
    id: '3',
    title: 'Cloud Computing Trends Shaping 2024',
    slug: 'cloud-computing-trends-2024',
    excerpt:
      'From edge computing to serverless architectures, discover the key cloud computing trends that will define enterprise technology strategies this year.',
    content: `# Cloud Computing Trends 2024

Cloud computing continues to transform how businesses operate and deliver services. Here are the key trends shaping the industry in 2024.

## Edge Computing Expansion

Edge computing is moving from niche to mainstream as organizations seek to reduce latency and improve user experience. Key developments include:
- 5G-enabled edge deployments
- AI processing at the edge
- Improved edge security frameworks

## Serverless Evolution

Serverless architectures are maturing with:
- Better cold start performance
- Enhanced monitoring capabilities
- Multi-cloud serverless solutions
- Improved cost optimization tools

## AI Integration in Cloud Services

AI is becoming integral to cloud platforms:
- Automated resource optimization
- Intelligent security monitoring
- Predictive scaling
- AI-powered development tools`,
    author: 'Emily Rodriguez',
    publishedAt: '2024-01-13T09:15:00.000Z',
    updatedAt: '2024-01-13T09:15:00.000Z',
    category: 'Cloud Computing',
    tags: ['Cloud', 'AWS', 'Azure', 'Serverless', 'Edge Computing'],
    imageUrl: 'https://picsum.photos/seed/cloud-trends/800/400.jpg',
    readTime: 6,
    featured: false,
  },
  {
    id: '4',
    title: 'Cybersecurity Threats: New Challenges for 2024',
    slug: 'cybersecurity-threats-2024',
    excerpt:
      'As technology advances, so do cyber threats. Learn about the emerging security challenges and how organizations are preparing to defend against them.',
    content: `# Cybersecurity Threats 2024

The cybersecurity landscape continues to evolve with new threats emerging as technology advances. Organizations must stay ahead of these challenges to protect their digital assets.

## AI-Powered Attacks

Cybercriminals are leveraging AI for:
- Sophisticated phishing campaigns
- Automated vulnerability discovery
- Adaptive malware that evolves in real-time
- Deepfake social engineering attacks

## Supply Chain Vulnerabilities

Software supply chain attacks remain a major concern:
- Third-party library compromises
- Build process infiltrations
- Code repository attacks
- Dependency confusion exploits

## Ransomware Evolution

Ransomware continues to evolve with:
- Double extortion tactics
- Cloud-specific attacks
- Targeted industry campaigns
- Cryptocurrency-based payment systems`,
    author: 'David Kim',
    publishedAt: '2024-01-12T16:45:00.000Z',
    updatedAt: '2024-01-12T16:45:00.000Z',
    category: 'Cybersecurity',
    tags: ['Security', 'Ransomware', 'AI', 'Threats', 'Protection'],
    imageUrl: 'https://picsum.photos/seed/cybersecurity-2024/800/400.jpg',
    readTime: 7,
    featured: false,
  },
  {
    id: '5',
    title: 'Quantum Computing: From Theory to Reality',
    slug: 'quantum-computing-reality-2024',
    excerpt:
      'Quantum computing is moving from theoretical research to practical applications. Explore the breakthroughs that are making quantum computers a reality.',
    content: `# Quantum Computing: From Theory to Reality

2024 marks a pivotal year for quantum computing as we transition from theoretical research to practical applications. Recent breakthroughs are bringing quantum computers closer to real-world use.

## Hardware Breakthroughs

Significant advances in quantum hardware include:
- Increased qubit stability
- Error reduction improvements
- Room-temperature quantum systems
- Scalable quantum processor designs

## Practical Applications

Quantum computing is finding real-world applications in:
- Drug discovery and molecular simulation
- Financial modeling and risk analysis
- Cryptography and security
- Optimization problems

## Industry Adoption

Major companies are investing heavily in quantum:
- IBM's quantum network expansion
- Google's quantum supremacy claims
- Microsoft's quantum development platform
- Startup innovations in quantum algorithms`,
    author: 'Dr. Lisa Wang',
    publishedAt: '2024-01-11T11:20:00.000Z',
    updatedAt: '2024-01-11T11:20:00.000Z',
    category: 'Quantum Computing',
    tags: ['Quantum', 'Computing', 'Research', 'Innovation', 'Hardware'],
    imageUrl: 'https://picsum.photos/seed/quantum-computing/800/400.jpg',
    readTime: 9,
    featured: true,
  },
];

export const techNewsApi = createApi({
  reducerPath: 'techNewsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['TechNewsArticle', 'TechNewsList'],
  endpoints: (builder) => ({
    // Get all tech news articles
    getTechNews: builder.query<
      TechNewsList,
      { page?: number; limit?: number; category?: string }
    >({
      queryFn: async ({ page = 1, limit = 10, category }) => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Filter articles by category if specified
          let filteredArticles = mockArticles;
          if (category) {
            filteredArticles = mockArticles.filter(
              (article) => article.category === category
            );
          }

          // Get unique categories
          const allCategories = [
            ...new Set(mockArticles.map((article) => article.category)),
          ];

          return {
            data: {
              articles: filteredArticles.slice(
                (page - 1) * limit,
                page * limit
              ),
              categories: allCategories,
              total: filteredArticles.length,
              page,
              limit,
            },
          };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['TechNewsList'],
    }),

    // Get single tech news article by slug
    getTechNewsArticle: builder.query<TechNewsArticle | null, string>({
      queryFn: async (slug) => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300));

          const article = mockArticles.find((article) => article.slug === slug);

          if (!article) {
            return { data: null };
          }

          return { data: article };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: (_result, _error, _slug) =>
        _result ? [{ type: 'TechNewsArticle', id: _result.id }] : [],
    }),

    // Get featured tech news articles
    getFeaturedTechNews: builder.query<TechNewsArticle[], void>({
      queryFn: async () => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 400));

          const featuredArticles = mockArticles.filter(
            (article) => article.featured
          );

          return { data: featuredArticles };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['TechNewsList'],
    }),
  }),
});

export const {
  useGetTechNewsQuery,
  useGetTechNewsArticleQuery,
  useGetFeaturedTechNewsQuery,
} = techNewsApi;

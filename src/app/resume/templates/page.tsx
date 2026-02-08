'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetTemplatesQuery } from '@/store/slices/resumeSlice';

export default function ResumeTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data: templates, isLoading, error } = useGetTemplatesQuery();

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In a real implementation, this would save the template preference
  };

  const handleCreateResume = (templateId: string) => {
    // Navigate to resume creation with selected template
    window.location.href = `/resume/new?template=${templateId}`;
  };

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
          Error loading templates
        </h2>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Resume Template</h1>
        <p className="text-gray-600 mb-6">
          Select a professional template that best represents your style and
          industry. Each template is designed to highlight different strengths
          and career paths.
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {templates?.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <CardHeader className="p-0">
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                <div className="text-4xl font-bold text-gray-700">
                  {template.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
              <CardDescription className="text-gray-600 mb-4">
                {template.description}
              </CardDescription>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="secondary">{template.category}</Badge>
                  <Badge variant="outline">Professional</Badge>
                </div>

                {selectedTemplate === template.id && (
                  <Button
                    onClick={() => handleCreateResume(template.id)}
                    className="w-full"
                  >
                    Use This Template
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Templates State */}
      {(!templates || templates.length === 0) && (
        <div className="text-center py-16">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2v-4a2 2 0 012-2h6a2 2 0 012-2v4a2 2 0 01-2 2m-6 4h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No templates available
            </h3>
            <p className="text-gray-600 mb-6">
              Resume templates are currently unavailable. Please check back
              later.
            </p>
          </div>
          <Link href="/resume/new">
            <Button size="lg">Create Custom Resume</Button>
          </Link>
        </div>
      )}

      {/* Selected Template Actions */}
      {selectedTemplate && (
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">
              Template Selected:{' '}
              {templates?.find((t) => t.id === selectedTemplate)?.name}
            </h3>
            <p className="text-blue-700 mb-4">
              Ready to create your professional resume with this template?
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleCreateResume(selectedTemplate)}
                size="lg"
                className="px-8"
              >
                Create Resume with This Template
              </Button>
              <Button
                onClick={() => setSelectedTemplate(null)}
                variant="outline"
              >
                Choose Different Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

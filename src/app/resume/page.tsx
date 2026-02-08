'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetResumesQuery } from '@/store/slices/resumeSlice';

export default function ResumeBuilderPage() {
  const { data: resumes, isLoading, error } = useGetResumesQuery();

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
          Error loading resumes
        </h2>
        <p className="text-gray-600 mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Resume Builder</h1>
        <p className="text-gray-600 mb-6">
          Create professional resumes with our easy-to-use builder. Choose from
          templates, customize your content, and download in multiple formats.
        </p>

        <div className="flex gap-4 mb-8">
          <Link href="/resume/new">
            <Button>Create New Resume</Button>
          </Link>
        </div>
      </div>

      {/* Existing Resumes */}
      {resumes && resumes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Resumes</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                      {resume.template}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(resume.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">
                    <Link
                      href={`/resume/edit/${resume.id}`}
                      className="hover:text-blue-600"
                    >
                      {resume.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {resume.personalInfo.summary}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{resume.personalInfo.fullName}</span>
                    <span>{resume.workExperience.length} positions</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/resume/edit/${resume.id}`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/resume/preview/${resume.id}`}>
                      <Button size="sm">Preview</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Resumes State */}
      {(!resumes || resumes.length === 0) && (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2v-4a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2m-6 4h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first professional resume to get started
            </p>
          </div>
          <Link href="/resume/new">
            <Button size="lg">Create Your First Resume</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

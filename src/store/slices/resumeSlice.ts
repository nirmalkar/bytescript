import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Resume, ResumeTemplate } from '@/types/resume';

// Mock data for development
const mockResumes: Resume[] = [
  {
    id: '1',
    title: 'Software Developer Resume',
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      summary:
        'Experienced software developer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable solutions and mentoring junior developers.',
    },
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8',
        description:
          'Graduated Magna Cum Laude with focus on Software Engineering and Data Structures',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2021-06',
        endDate: '',
        current: true,
        description:
          'Lead development of microservices architecture serving 1M+ users. Mentored team of 5 junior developers.',
        achievements: [
          'Reduced API response time by 40% through optimization',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
          'Led migration to microservices architecture',
        ],
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Software Engineer',
        location: 'Austin, TX',
        startDate: '2020-06',
        endDate: '2021-05',
        current: false,
        description:
          'Developed and maintained web applications using React, Node.js, and AWS. Collaborated with cross-functional teams.',
        achievements: [
          'Built real-time collaboration features used by 50K+ users',
          'Improved application performance by 35%',
          'Implemented automated testing reducing bugs by 45%',
        ],
      },
    ],
    projects: [
      {
        id: '1',
        name: 'E-Commerce Platform',
        description:
          'Full-stack e-commerce solution with real-time inventory management and payment processing',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Docker'],
        startDate: '2023-01',
        url: 'https://ecommerce-demo.com',
        highlights: [
          'Processed $1M+ in transactions',
          '99.9% uptime achieved',
          'Featured in TechCrunch',
        ],
      },
      {
        id: '2',
        name: 'Task Management App',
        description:
          'Collaborative task management tool with real-time updates and team analytics',
        technologies: ['Vue.js', 'Firebase', 'Tailwind CSS', 'Chart.js'],
        startDate: '2022-06',
        highlights: [
          '10K+ active users',
          '4.8/5 user rating',
          'Reduced team coordination time by 30%',
        ],
      },
    ],
    skills: [
      {
        id: '1',
        name: 'JavaScript',
        level: 'Expert',
        category: 'Programming Languages',
      },
      {
        id: '2',
        name: 'React',
        level: 'Expert',
        category: 'Frontend Frameworks',
      },
      {
        id: '3',
        name: 'Node.js',
        level: 'Advanced',
        category: 'Backend Technologies',
      },
      {
        id: '4',
        name: 'AWS',
        level: 'Advanced',
        category: 'Cloud Platforms',
      },
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2022-03',
        url: 'https://aws.amazon.com/certification',
      },
      {
        id: '2',
        name: 'Google Cloud Professional',
        issuer: 'Google Cloud',
        date: '2021-11',
        url: 'https://cloud.google.com/certification',
      },
    ],
    template: 'modern',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-20T15:30:00.000Z',
  },
];

const mockTemplates: ResumeTemplate[] = [
  {
    id: '1',
    name: 'Modern',
    description: 'Clean and contemporary design with sidebar layout',
    preview: '/templates/modern-preview.png',
    category: 'modern',
  },
  {
    id: '2',
    name: 'Minimal',
    description: 'Simple and clean design focusing on content',
    preview: '/templates/minimal-preview.png',
    category: 'minimal',
  },
];

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Resume', 'ResumeTemplate'],
  endpoints: (builder) => ({
    // Get all resumes
    getResumes: builder.query<Resume[], void>({
      queryFn: async () => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          return { data: mockResumes };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['Resume'],
    }),

    // Get single resume by ID
    getResume: builder.query<Resume | null, string>({
      queryFn: async (id) => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300));

          const resume = mockResumes.find((resume) => resume.id === id);

          if (!resume) {
            return { data: null };
          }

          return { data: resume };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: (_result, _error, _id) =>
        _result ? [{ type: 'Resume', id: _result.id }] : [],
    }),

    // Create/update resume
    saveResume: builder.mutation<Resume, Partial<Resume> & { id?: string }>({
      queryFn: async (resumeData) => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          if (resumeData.id) {
            // Update existing resume
            const index = mockResumes.findIndex((r) => r.id === resumeData.id);
            if (index !== -1) {
              mockResumes[index] = {
                ...mockResumes[index],
                ...resumeData,
                updatedAt: new Date().toISOString(),
              } as Resume;
            }
          } else {
            // Create new resume
            const newResume: Resume = {
              id: Date.now().toString(),
              title: resumeData.title || 'New Resume',
              personalInfo: resumeData.personalInfo || {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                summary: '',
              },
              education: resumeData.education || [],
              workExperience: resumeData.workExperience || [],
              projects: resumeData.projects || [],
              skills: resumeData.skills || [],
              certifications: resumeData.certifications || [],
              template: resumeData.template || 'modern',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            mockResumes.push(newResume);
          }

          return {
            data: resumeData.id
              ? mockResumes.find((r) => r.id === resumeData.id)
              : mockResumes[mockResumes.length - 1],
          };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Resume'],
    }),

    // Delete resume
    deleteResume: builder.mutation<string, string>({
      queryFn: async (id) => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 400));

          const index = mockResumes.findIndex((resume) => resume.id === id);
          if (index !== -1) {
            mockResumes.splice(index, 1);
          }

          return { data: id };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      invalidatesTags: ['Resume'],
    }),

    // Get resume templates
    getTemplates: builder.query<ResumeTemplate[], void>({
      queryFn: async () => {
        try {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300));

          return { data: mockTemplates };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error as Error } };
        }
      },
      providesTags: ['ResumeTemplate'],
    }),
  }),
});

export const {
  useGetResumesQuery,
  useGetResumeQuery,
  useSaveResumeMutation,
  useDeleteResumeMutation,
  useGetTemplatesQuery,
} = resumeApi;

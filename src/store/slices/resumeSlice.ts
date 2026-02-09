import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from '@/firebase/config';
import type { Resume, ResumeTemplate } from '@/types/resume';
import { toISOString } from '@/utils/timestamp';

const RESUMES_COLLECTION = 'resumes';
const TEMPLATES_COLLECTION = 'resumeTemplates';

// Transform Firestore resume document to Resume type
const transformResumeDoc = (doc: any): Resume => {
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  } as Resume;
};

// Transform Firestore template document to ResumeTemplate type
const transformTemplateDoc = (doc: any): ResumeTemplate => {
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  } as ResumeTemplate;
};

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Resume', 'ResumeTemplate'],
  endpoints: (builder) => ({
    // Get all resumes
    getResumes: builder.query<Resume[], void>({
      queryFn: async () => {
        try {
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const q = query(
            collection(db, RESUMES_COLLECTION),
            orderBy('updatedAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          return { data: querySnapshot.docs.map(transformResumeDoc) };
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
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(db, RESUMES_COLLECTION, id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            return { data: transformResumeDoc(docSnap) };
          }
          return { data: null };
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
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          if (resumeData.id) {
            // Update existing resume
            const docRef = doc(db, RESUMES_COLLECTION, resumeData.id);
            const updateData = {
              ...resumeData,
              updatedAt: new Date().toISOString(),
            };

            await updateDoc(docRef, updateData);

            // Return updated resume
            const updatedDocSnap = await getDoc(docRef);
            if (updatedDocSnap.exists()) {
              return { data: transformResumeDoc(updatedDocSnap) };
            }
            throw new Error('Failed to retrieve updated resume');
          } else {
            // Create new resume
            const now = new Date().toISOString();
            const newResumeData = {
              ...resumeData,
              createdAt: now,
              updatedAt: now,
            };

            const docRef = await addDoc(
              collection(db, RESUMES_COLLECTION),
              newResumeData
            );

            // Return created resume
            const newDocSnap = await getDoc(docRef);
            if (newDocSnap.exists()) {
              return { data: transformResumeDoc(newDocSnap) };
            }
            throw new Error('Failed to retrieve created resume');
          }
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
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const docRef = doc(db, RESUMES_COLLECTION, id);
          await deleteDoc(docRef);
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
          if (!db) {
            throw new Error('Firestore not initialized');
          }

          const querySnapshot = await getDocs(
            collection(db, TEMPLATES_COLLECTION)
          );
          return { data: querySnapshot.docs.map(transformTemplateDoc) };
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

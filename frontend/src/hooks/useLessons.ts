import { useCallback } from 'react';
import { lessonsAPI } from '../api/apiClient';
import { useApi, useApiMutation, usePaginatedApi } from './useApi';

// Types for lesson data
export interface Lesson {
  _id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
  course: {
    _id: string;
    title: string;
  };
  isPublished: boolean;
  resources?: Array<{
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'link' | 'document';
  }>;
  quiz?: {
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
  courseId: string;
  resources?: Array<{
    title: string;
    url: string;
    type: 'pdf' | 'video' | 'link' | 'document';
  }>;
}

// Hook for getting lessons by course
export function useLessonsByCourse(courseId: string) {
  const apiCall = useCallback(() => {
    return lessonsAPI.getLessonsByCourse(courseId);
  }, [courseId]);

  return useApi<Lesson[]>(apiCall, [courseId]);
}

// Hook for getting a single lesson
export function useLesson(lessonId: string) {
  const apiCall = useCallback(() => {
    return lessonsAPI.getLesson(lessonId);
  }, [lessonId]);

  return useApi<Lesson>(apiCall, [lessonId]);
}

// Hook for creating a lesson
export function useCreateLesson() {
  return useApiMutation<Lesson, CreateLessonData>(lessonsAPI.createLesson);
}

// Hook for updating a lesson
export function useUpdateLesson() {
  return useApiMutation<Lesson, { id: string; data: Partial<CreateLessonData> }>(
    ({ id, data }) => lessonsAPI.updateLesson(id, data)
  );
}

// Hook for deleting a lesson
export function useDeleteLesson() {
  return useApiMutation<void, string>(lessonsAPI.deleteLesson);
}

// Hook for getting lesson progress for a specific course
export function useLessonProgress(courseId: string) {
  const apiCall = useCallback(() => {
    return lessonsAPI.getLessonProgress(courseId);
  }, [courseId]);

  return useApi<{ lessonId: string; completed: boolean; completedAt?: string }[]>(
    apiCall, 
    [courseId]
  );
}

// Hook for marking lesson as completed
export function useMarkLessonComplete() {
  return useApiMutation<void, { courseId: string; lessonId: string }>(
    ({ courseId, lessonId }) => lessonsAPI.markLessonComplete(courseId, lessonId)
  );
}

// Hook for getting next lesson in course
export function useNextLesson(courseId: string, currentLessonOrder: number) {
  const { data: lessons } = useLessonsByCourse(courseId);
  
  const nextLesson = lessons?.find(lesson => 
    lesson.order === currentLessonOrder + 1 && lesson.isPublished
  );

  return { nextLesson };
}

// Hook for getting previous lesson in course
export function usePreviousLesson(courseId: string, currentLessonOrder: number) {
  const { data: lessons } = useLessonsByCourse(courseId);
  
  const previousLesson = lessons?.find(lesson => 
    lesson.order === currentLessonOrder - 1 && lesson.isPublished
  );

  return { previousLesson };
}

// Hook for lesson navigation
export function useLessonNavigation(courseId: string, currentLessonOrder: number) {
  const { nextLesson } = useNextLesson(courseId, currentLessonOrder);
  const { previousLesson } = usePreviousLesson(courseId, currentLessonOrder);
  const { data: lessons } = useLessonsByCourse(courseId);

  const totalLessons = lessons?.filter(lesson => lesson.isPublished).length || 0;
  const currentLessonIndex = lessons?.findIndex(lesson => lesson.order === currentLessonOrder) || 0;

  return {
    nextLesson,
    previousLesson,
    totalLessons,
    currentLessonIndex: currentLessonIndex + 1,
    hasNext: !!nextLesson,
    hasPrevious: !!previousLesson
  };
}

// Hook for course completion status
export function useCourseCompletion(courseId: string) {
  const { data: lessons } = useLessonsByCourse(courseId);
  const { data: progress } = useLessonProgress(courseId);

  const totalLessons = lessons?.filter(lesson => lesson.isPublished).length || 0;
  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    completionPercentage,
    isCompleted: completionPercentage === 100
  };
}

// Hook for lesson statistics (for instructors)
export function useLessonStats(courseId: string) {
  const { data: lessons, loading, error } = useLessonsByCourse(courseId);

  const stats = {
    totalLessons: lessons?.length || 0,
    publishedLessons: lessons?.filter(lesson => lesson.isPublished).length || 0,
    unpublishedLessons: lessons?.filter(lesson => !lesson.isPublished).length || 0,
    totalDuration: lessons?.reduce((sum, lesson) => sum + lesson.duration, 0) || 0,
    averageDuration: lessons?.length 
      ? lessons.reduce((sum, lesson) => sum + lesson.duration, 0) / lessons.length 
      : 0,
  };

  return { stats, loading, error };
}
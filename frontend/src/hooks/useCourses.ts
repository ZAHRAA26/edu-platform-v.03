import { useCallback } from 'react';
import { coursesAPI } from '../api/apiClient';
import { useApi, useApiMutation, usePaginatedApi } from './useApi';

// Types for course data
export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  thumbnail?: string;
  tags: string[];
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  isPublished: boolean;
  maxStudents?: number;
  enrolledStudents?: number;
  lessonsCount?: number;
  totalDuration?: number;
  averageRating?: number;
  ratingsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  instructor?: string;
  isPublished?: boolean;
}

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  price: number;
  thumbnail?: string;
  tags: string[];
  maxStudents?: number;
}

// Hook for getting all courses with pagination and filters
export function useCourses(
  page: number = 1,
  limit: number = 10,
  filters: CourseFilters = {}
) {
  const apiCall = useCallback(
    (currentPage: number, currentLimit: number, currentFilters: CourseFilters) => {
      const params = {
        page: currentPage,
        limit: currentLimit,
        ...currentFilters
      };
      return coursesAPI.getCourses(params);
    },
    []
  );

  return usePaginatedApi<Course>(apiCall, page, limit, filters);
}

// Hook for getting a single course
export function useCourse(courseId: string) {
  const apiCall = useCallback(() => {
    return coursesAPI.getCourse(courseId);
  }, [courseId]);

  return useApi<Course>(apiCall, [courseId]);
}

// Hook for creating a course
export function useCreateCourse() {
  return useApiMutation<Course, CreateCourseData>(coursesAPI.createCourse);
}

// Hook for updating a course
export function useUpdateCourse() {
  return useApiMutation<Course, { id: string; data: Partial<CreateCourseData> }>(
    ({ id, data }) => coursesAPI.updateCourse(id, data)
  );
}

// Hook for deleting a course
export function useDeleteCourse() {
  return useApiMutation<void, string>(coursesAPI.deleteCourse);
}

// Hook for getting popular courses
export function usePopularCourses(limit: number = 6) {
  const apiCall = useCallback(() => {
    return coursesAPI.getCourses({ 
      limit, 
      sortBy: 'enrolledStudents', 
      sortOrder: 'desc',
      isPublished: true 
    });
  }, [limit]);

  return useApi<Course[]>(apiCall, [limit]);
}

// Hook for getting courses by category
export function useCoursesByCategory(category: string, limit: number = 10) {
  const apiCall = useCallback(() => {
    return coursesAPI.getCourses({ 
      category, 
      limit,
      isPublished: true 
    });
  }, [category, limit]);

  return useApi<Course[]>(apiCall, [category, limit]);
}

// Hook for getting instructor's courses
export function useInstructorCourses(instructorId?: string) {
  const apiCall = useCallback(() => {
    if (!instructorId) {
      return Promise.reject(new Error('Instructor ID is required'));
    }
    return coursesAPI.getCourses({ instructor: instructorId });
  }, [instructorId]);

  return useApi<Course[]>(apiCall, [instructorId]);
}

// Hook for course statistics (for admin/instructor dashboard)
export function useCourseStats() {
  const apiCall = useCallback(() => {
    return coursesAPI.getCourses({ 
      limit: 1000, // Get all courses for stats
      fields: '_id,title,enrolledStudents,averageRating,createdAt' 
    });
  }, []);

  const { data: courses, loading, error } = useApi<Course[]>(apiCall);

  const stats = {
    totalCourses: courses?.length || 0,
    totalEnrollments: courses?.reduce((sum, course) => sum + (course.enrolledStudents || 0), 0) || 0,
    averageRating: courses?.length 
      ? courses.reduce((sum, course) => sum + (course.averageRating || 0), 0) / courses.length 
      : 0,
    publishedCourses: courses?.filter(course => course.isPublished).length || 0,
    unpublishedCourses: courses?.filter(course => !course.isPublished).length || 0,
  };

  return { stats, loading, error };
}
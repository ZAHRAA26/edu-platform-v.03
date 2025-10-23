import { useCallback } from 'react';
import { enrollmentsAPI } from '../api/apiClient';
import { useApi, useApiMutation } from './useApi';
import { Course } from './useCourses';

// Types for enrollment data
export interface Enrollment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  course: Course;
  enrolledAt: string;
  progress: number;
  completedLessons: string[];
  lastAccessedAt?: string;
  certificateIssued?: boolean;
  certificateIssuedAt?: string;
}

export interface EnrollmentProgress {
  courseId: string;
  progress: number;
  completedLessons?: string[];
}

// Hook for enrolling in a course
export function useEnrollInCourse() {
  return useApiMutation<Enrollment, string>(enrollmentsAPI.enroll);
}

// Hook for getting user's enrollments
export function useMyEnrollments() {
  const apiCall = useCallback(() => {
    return enrollmentsAPI.getMyEnrollments();
  }, []);

  return useApi<Enrollment[]>(apiCall);
}

// Hook for updating enrollment progress
export function useUpdateProgress() {
  return useApiMutation<Enrollment, EnrollmentProgress>(
    ({ courseId, progress, completedLessons }) => 
      enrollmentsAPI.updateProgress(courseId, progress)
  );
}

// Hook for unenrolling from a course
export function useUnenrollFromCourse() {
  return useApiMutation<void, string>(enrollmentsAPI.unenroll);
}

// Hook for getting course enrollments (for instructors/admin)
export function useCourseEnrollments(courseId: string) {
  const apiCall = useCallback(() => {
    return enrollmentsAPI.getCourseEnrollments(courseId);
  }, [courseId]);

  return useApi<Enrollment[]>(apiCall, [courseId]);
}

// Hook for checking if user is enrolled in a course
export function useIsEnrolled(courseId: string) {
  const { data: enrollments, loading, error } = useMyEnrollments();
  
  const isEnrolled = enrollments?.some(enrollment => 
    enrollment.course._id === courseId
  ) || false;

  const enrollment = enrollments?.find(enrollment => 
    enrollment.course._id === courseId
  );

  return { isEnrolled, enrollment, loading, error };
}

// Hook for enrollment statistics
export function useEnrollmentStats() {
  const { data: enrollments, loading, error } = useMyEnrollments();

  const stats = {
    totalEnrollments: enrollments?.length || 0,
    completedCourses: enrollments?.filter(e => e.progress >= 100).length || 0,
    inProgressCourses: enrollments?.filter(e => e.progress > 0 && e.progress < 100).length || 0,
    notStartedCourses: enrollments?.filter(e => e.progress === 0).length || 0,
    averageProgress: enrollments?.length 
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length 
      : 0,
    certificatesEarned: enrollments?.filter(e => e.certificateIssued).length || 0,
  };

  return { stats, enrollments, loading, error };
}

// Hook for recent enrollments (for dashboard)
export function useRecentEnrollments(limit: number = 5) {
  const { data: enrollments, loading, error } = useMyEnrollments();

  const recentEnrollments = enrollments
    ?.sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    .slice(0, limit);

  return { recentEnrollments, loading, error };
}

// Hook for course progress tracking
export function useCourseProgress(courseId: string) {
  const { enrollment, loading, error } = useIsEnrolled(courseId);
  const { mutate: updateProgress, loading: updating } = useUpdateProgress();

  const updateCourseProgress = useCallback(async (progress: number, completedLessons?: string[]) => {
    try {
      await updateProgress({ courseId, progress, completedLessons });
      // Optionally trigger a refetch of enrollments
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  }, [courseId, updateProgress]);

  return {
    progress: enrollment?.progress || 0,
    completedLessons: enrollment?.completedLessons || [],
    updateCourseProgress,
    loading,
    updating,
    error
  };
}
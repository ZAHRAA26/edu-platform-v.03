// Shared Types between Frontend and Backend
// This file contains common interfaces and types used across the application

// User Types
export interface IUser {
  _id?: string;
  username: string;
  email: string;
  auth0Id: string;
  name?: string;
  picture?: string;
  roles: UserRole[];
  isDisabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'teacher' | 'student';

// Course Types
export interface ICourse {
  _id?: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: number;
  price: number;
  thumbnail?: string;
  tags: string[];
  instructor: string | IUser;
  isPublished: boolean;
  maxStudents?: number;
  enrolledStudents?: number;
  lessonsCount?: number;
  totalDuration?: number;
  averageRating?: number;
  ratingsCount?: number;
  createdBy: string | IUser;
  updatedBy: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseLevel = 'مبتدئ' | 'متوسط' | 'متقدم' | 'beginner' | 'intermediate' | 'advanced';

// Lesson Types
export interface ILesson {
  _id?: string;
  title: string;
  description?: string;
  content?: string;
  duration: number;
  order: number;
  course: string | ICourse;
  videoUrl?: string;
  resources?: string[];
  isPublished: boolean;
  createdBy: string | IUser;
  updatedBy: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

// Enrollment Types
export interface IEnrollment {
  _id?: string;
  user: string | IUser;
  course: string | ICourse;
  enrolledAt: Date;
  progress: number;
  completedLessons: string[];
  lastAccessedAt?: Date;
  certificateIssued?: boolean;
  certificateIssuedAt?: Date;
}

// Rating Types
export interface IRating {
  _id?: string;
  user: string | IUser;
  course: string | ICourse;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Device Types
export interface IDevice {
  _id?: string;
  user: string | IUser;
  deviceId: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution: string;
    timezone: string;
    fingerprint: string;
  };
  isActive: boolean;
  lastUsedAt: Date;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Search and Filter Types
export interface SearchParams {
  search?: string;
  category?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  instructor?: string;
  isPublished?: boolean;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Auth Types
export interface LoginRequest {
  deviceIdentifier: string;
  deviceInfo: IDevice['deviceInfo'];
  auth0UserData?: any;
}

export interface LoginResponse {
  user: IUser;
  device: IDevice;
  token?: string;
}

// File Upload Types
export interface FileUploadResponse {
  success: boolean;
  filePath: string;
  originalName: string;
  size: number;
  mimeType: string;
  url?: string;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentEnrollments: IEnrollment[];
  popularCourses: ICourse[];
  userGrowth: {
    month: string;
    count: number;
  }[];
  revenueGrowth: {
    month: string;
    amount: number;
  }[];
}

// Notification Types
export interface INotification {
  _id?: string;
  user: string | IUser;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

export type NotificationType = 'enrollment' | 'course_update' | 'new_lesson' | 'certificate' | 'system' | 'payment';

// Settings Types
export interface UserSettings {
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showProgress: boolean;
  };
}

// Course Creation/Update Types
export interface CreateCourseRequest {
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  duration: number;
  price: number;
  thumbnail?: string;
  tags: string[];
  maxStudents?: number;
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isPublished?: boolean;
}

// Lesson Creation/Update Types
export interface CreateLessonRequest {
  title: string;
  description?: string;
  content?: string;
  duration: number;
  order: number;
  course: string;
  videoUrl?: string;
  resources?: string[];
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  isPublished?: boolean;
}

// Rating Creation/Update Types
export interface CreateRatingRequest {
  course: string;
  rating: number;
  comment?: string;
}

export interface UpdateRatingRequest {
  rating?: number;
  comment?: string;
}

// Enrollment Progress Update
export interface UpdateProgressRequest {
  progress: number;
  completedLessons?: string[];
}

// Constants
export const USER_ROLES: UserRole[] = ['admin', 'teacher', 'student'];
export const COURSE_LEVELS: CourseLevel[] = ['مبتدئ', 'متوسط', 'متقدم', 'beginner', 'intermediate', 'advanced'];
export const NOTIFICATION_TYPES: NotificationType[] = ['enrollment', 'course_update', 'new_lesson', 'certificate', 'system', 'payment'];

// Validation Constants
export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
  },
  courseTitle: {
    minLength: 5,
    maxLength: 200,
  },
  courseDescription: {
    minLength: 20,
    maxLength: 2000,
  },
  lessonTitle: {
    minLength: 5,
    maxLength: 200,
  },
  rating: {
    min: 1,
    max: 5,
  },
  comment: {
    minLength: 10,
    maxLength: 500,
  },
  price: {
    min: 0,
    max: 10000,
  },
  duration: {
    min: 1,
    max: 1000,
  },
};

// Default Values
export const DEFAULT_VALUES = {
  pagination: {
    page: 1,
    limit: 10,
  },
  course: {
    level: 'مبتدئ' as CourseLevel,
    price: 0,
    duration: 60,
    maxStudents: 100,
  },
  user: {
    roles: ['student'] as UserRole[],
    language: 'ar',
    theme: 'light',
  },
  device: {
    maxDevices: 2,
  },
};
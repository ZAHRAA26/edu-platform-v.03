import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLessonsByCourse, useLessonProgress, useMarkLessonComplete, useCourseCompletion } from '../hooks/useLessons';
import { useCourse } from '../hooks/useCourses';
import { useIsEnrolled } from '../hooks/useEnrollments';

const Lessons: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, hasRole } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  // Fetch data using custom hooks
  const { data: course, loading: courseLoading, error: courseError } = useCourse(courseId!);
  const { data: lessons, loading: lessonsLoading, error: lessonsError } = useLessonsByCourse(courseId!);
  const { data: progress, loading: progressLoading } = useLessonProgress(courseId!);
  const { isEnrolled, loading: enrollmentLoading } = useIsEnrolled(courseId!);
  const { completionPercentage, completedLessons, totalLessons } = useCourseCompletion(courseId!);
  const { mutate: markComplete, loading: markingComplete } = useMarkLessonComplete();

  if (!courseId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">معرف الدورة مفقود</div>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700">
            العودة إلى الدورات
          </Link>
        </div>
      </div>
    );
  }

  // Handle lesson completion
  const handleMarkComplete = async (lessonId: string) => {
    try {
      await markComplete({ courseId, lessonId });
      // Show success message
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId: string) => {
    return progress?.some(p => p.lessonId === lessonId && p.completed) || false;
  };

  // Loading state
  if (courseLoading || lessonsLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
              <div>
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-300 rounded mb-2"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (courseError || lessonsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">حدث خطأ في تحميل الدورة أو الدروس</div>
          <p className="text-gray-600 mb-4">{courseError || lessonsError}</p>
          <Link 
            to="/courses" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            العودة إلى الدورات
          </Link>
        </div>
      </div>
    );
  }

  // Check enrollment for students
  if (isAuthenticated && hasRole('student') && !isEnrolled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-xl mb-4">يجب التسجيل في الدورة أولاً</div>
          <p className="text-gray-600 mb-6">للوصول إلى دروس هذه الدورة، يجب عليك التسجيل فيها أولاً</p>
          <div className="space-y-4">
            <Link 
              to={`/courses/${courseId}`}
              className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              عرض تفاصيل الدورة
            </Link>
            <Link 
              to="/courses" 
              className="block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              تصفح الدورات الأخرى
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-4">
            <Link to="/courses" className="hover:text-blue-600">الدورات</Link>
            <span>/</span>
            <Link to={`/courses/${courseId}`} className="hover:text-blue-600">{course?.title}</Link>
            <span>/</span>
            <span className="text-gray-900">الدروس</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
              <p className="text-gray-600">{course?.description}</p>
            </div>
            
            {hasRole('teacher') || hasRole('admin') ? (
              <Link
                to={`/courses/${courseId}/lessons/new`}
                className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                إضافة درس جديد
              </Link>
            ) : null}
          </div>

          {/* Progress Bar for Students */}
          {isAuthenticated && hasRole('student') && (
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">تقدم الدورة</span>
                <span className="text-sm text-gray-500">{completedLessons} من {totalLessons} دروس</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-right mt-1">
                <span className="text-sm font-medium text-blue-600">{completionPercentage}% مكتمل</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              // Show selected lesson content
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Lesson content will be rendered here */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {lessons?.find(l => l._id === selectedLesson)?.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {lessons?.find(l => l._id === selectedLesson)?.description}
                  </p>
                  {/* Video player or content area */}
                  <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">🎥</div>
                      <p>مشغل الفيديو سيظهر هنا</p>
                    </div>
                  </div>
                  
                  {/* Lesson Actions */}
                  {isAuthenticated && hasRole('student') && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleMarkComplete(selectedLesson)}
                        disabled={markingComplete || isLessonCompleted(selectedLesson)}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                          isLessonCompleted(selectedLesson)
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {markingComplete ? 'جاري الحفظ...' : 
                         isLessonCompleted(selectedLesson) ? 'مكتمل ✓' : 'تم الانتهاء'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Show course overview when no lesson is selected
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">نظرة عامة على الدورة</h2>
                <p className="text-gray-600 mb-6">{course?.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
                    <div className="text-sm text-gray-600">إجمالي الدروس</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{course?.duration || 0}</div>
                    <div className="text-sm text-gray-600">دقيقة</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">قائمة الدروس</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {lessons && lessons.length > 0 ? (
                  lessons
                    .filter(lesson => lesson.isPublished || hasRole('teacher') || hasRole('admin'))
                    .sort((a, b) => a.order - b.order)
                    .map((lesson, index) => {
                      const isCompleted = isLessonCompleted(lesson._id);
                      const isSelected = selectedLesson === lesson._id;
                      
                      return (
                        <div
                          key={lesson._id}
                          onClick={() => setSelectedLesson(lesson._id)}
                          className={`p-4 border-b cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <span className="text-sm text-gray-500">
                                  {index + 1}.
                                </span>
                                <h4 className="font-medium text-gray-900 line-clamp-2">
                                  {lesson.title}
                                </h4>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse mt-1">
                                <span className="text-xs text-gray-500">
                                  {lesson.duration} دقيقة
                                </span>
                                {!lesson.isPublished && (
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    مسودة
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {isCompleted && (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                              {(hasRole('teacher') || hasRole('admin')) && (
                                <Link
                                  to={`/courses/${courseId}/lessons/${lesson._id}/edit`}
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-4xl mb-4">📚</div>
                    <p>لا توجد دروس متاحة حالياً</p>
                    {(hasRole('teacher') || hasRole('admin')) && (
                      <Link
                        to={`/courses/${courseId}/lessons/new`}
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        إضافة أول درس
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;

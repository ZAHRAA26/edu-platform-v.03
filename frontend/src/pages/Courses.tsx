import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCourses, Course } from '../hooks/useCourses';
import { useEnrollInCourse, useIsEnrolled } from '../hooks/useEnrollments';

// Course component for individual course display
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const { isAuthenticated } = useAuth();
  const { isEnrolled } = useIsEnrolled(course._id);
  const { mutate: enrollInCourse, loading: enrolling } = useEnrollInCourse();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    try {
      await enrollInCourse(course._id);
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Enrollment failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-6xl">📚</div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {course.category}
          </span>
          <span className="text-sm text-gray-500">{course.level}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-2xl font-bold text-blue-600">
              {course.price === 0 ? 'مجاني' : `${course.price} ر.س`}
            </span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse text-yellow-500">
            <span className="text-sm">{course.averageRating?.toFixed(1) || '0.0'}</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span className="text-xs text-gray-500">({course.ratingsCount || 0})</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>👨‍🏫 {course.instructor.name}</span>
          <span>⏱️ {course.duration} دقيقة</span>
        </div>
        <div className="flex space-x-2 space-x-reverse">
          <Link
            to={`/courses/${course._id}`}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300 text-center"
          >
            عرض التفاصيل
          </Link>
          {isAuthenticated && !isEnrolled && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {enrolling ? 'جاري التسجيل...' : 'سجل الآن'}
            </button>
          )}
          {isEnrolled && (
            <Link
              to={`/courses/${course._id}/lessons`}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 text-center"
            >
              متابعة الدراسة
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const Courses: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Use the custom hook for courses with pagination and filters
  const {
    data: courses,
    loading,
    error,
    total,
    totalPages,
    page,
    goToPage,
    updateFilters
  } = useCourses(currentPage, 12, {
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
    level: selectedLevel || undefined,
    isPublished: true
  });

  // Handle filter changes
  const handleFilterChange = () => {
    updateFilters({
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      level: selectedLevel || undefined,
      isPublished: true
    });
    setCurrentPage(1);
  };

  // Categories and levels for filters
  const categories = ['البرمجة', 'التصميم', 'التسويق', 'الأعمال', 'اللغات'];
  const levels = ['مبتدئ', 'متوسط', 'متقدم'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">حدث خطأ في تحميل الدورات</div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">الدورات التدريبية</h1>
              <p className="text-gray-600">اكتشف مجموعة واسعة من الدورات التعليمية المتخصصة</p>
              {total > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  عرض {courses?.length || 0} من أصل {total} دورة
                </p>
              )}
            </div>
            {hasRole('teacher') || hasRole('admin') ? (
              <Link
                to="/courses/new"
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                إنشاء دورة جديدة
              </Link>
            ) : null}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
              <input
                type="text"
                placeholder="ابحث عن دورة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع التصنيفات</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المستوى</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">جميع المستويات</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilterChange}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                تطبيق الفلاتر
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses && courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">لا توجد دورات متاحة</div>
            <p className="text-gray-400">جرب تغيير معايير البحث</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 space-x-reverse mt-12">
                <button
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  السابق
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === page;
                  
                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-4 py-2 rounded-lg ${
                          isCurrentPage
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === page - 2 ||
                    pageNumber === page + 2
                  ) {
                    return <span key={pageNumber} className="px-2">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMyEnrollments, useEnrollmentStats, useRecentEnrollments } from '../hooks/useEnrollments';
import { usePopularCourses } from '../hooks/useCourses';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  // Fetch student data using custom hooks
  const { stats: enrollmentStats, loading: statsLoading } = useEnrollmentStats();
  const { recentEnrollments, loading: recentLoading } = useRecentEnrollments(5);
  const { data: recommendedCourses, loading: recommendedLoading } = usePopularCourses(4);

  // Create stats cards data
  const statsCards = [
    {
      title: 'الدورات المسجلة',
      value: enrollmentStats.totalEnrollments,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'الدورات المكتملة',
      value: enrollmentStats.completedCourses,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'الدورات قيد التقدم',
      value: enrollmentStats.inProgressCourses,
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'الشهادات المكتسبة',
      value: enrollmentStats.certificatesEarned,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  if (statsLoading || recentLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-8 bg-gray-300 rounded mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مرحباً، {user?.name || user?.username}! 👋
          </h1>
          <p className="text-gray-600">إليك نظرة عامة على تقدمك التعليمي</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
          <div key={index} className={`${stat.color} border rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">دوراتي</h2>
          <Link
            to="/courses"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            استكشف المزيد
          </Link>
        </div>

        {!recentEnrollments || recentEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl mb-4">لم تسجل في أي دورة بعد</div>
            <p className="text-gray-400 mb-6">ابدأ رحلتك التعليمية بالتسجيل في دورة</p>
            <Link
              to="/courses"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              تصفح الدورات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Course Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-semibold rounded-full text-gray-800">
                      {enrollment.progress}% مكتمل
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {enrollment.course.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">
                      👨‍🏫 {enrollment.course.instructor.name}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>التقدم</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2 space-x-reverse">
                    <Link
                      to={`/courses/${enrollment.course._id}/lessons`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm"
                    >
                      متابعة الدراسة
                    </Link>
                    <Link
                      to={`/courses/${enrollment.course._id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Courses Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">دورات مقترحة لك</h2>
          <Link
            to="/courses"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            عرض الكل
          </Link>
        </div>

        {recommendedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                <div className="h-32 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses?.slice(0, 4).map((course) => (
              <div key={course._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {course.thumbnail ? (
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-3xl">📚</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    👨‍🏫 {course.instructor.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-600">
                      {course.price === 0 ? 'مجاني' : `${course.price} ر.س`}
                    </span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      عرض
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default StudentDashboard;

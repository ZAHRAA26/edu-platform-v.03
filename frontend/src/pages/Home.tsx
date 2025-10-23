import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePopularCourses } from '../hooks/useCourses';
import { useCoursesByCategory } from '../hooks/useCourses';
import { config } from '../config/environment';

const Home: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  
  // Fetch popular courses from API
  const { data: popularCourses, loading: popularLoading, error: popularError } = usePopularCourses(6);
  
  // Fetch programming courses as featured category
  const { data: programmingCourses, loading: programmingLoading } = useCoursesByCategory('البرمجة', 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              منصة التعلم
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}الذكية
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              اكتشف عالماً جديداً من التعلم مع منصتنا التفاعلية. دورات متخصصة، محتوى عالي الجودة، ومتابعة شخصية لرحلتك التعليمية.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  الذهاب إلى لوحة التحكم
                </Link>
              ) : (
                <button
                  onClick={login}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  ابدأ رحلتك التعليمية
                </button>
              )}
              <Link
                to="/courses"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                استكشف الدورات
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار منصتنا؟</h2>
            <p className="text-xl text-gray-600">نقدم تجربة تعليمية متكاملة ومتطورة</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">محتوى متخصص</h3>
              <p className="text-gray-600">دورات مصممة بعناية من قبل خبراء في مختلف المجالات</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">أمان متقدم</h3>
              <p className="text-gray-600">نظام حماية متطور يضمن أمان حسابك وخصوصية بياناتك</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">تعلم تفاعلي</h3>
              <p className="text-gray-600">واجهة تفاعلية حديثة تجعل التعلم ممتعاً وفعالاً</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">الدورات الأكثر شعبية</h2>
            <p className="text-xl text-gray-600">اكتشف الدورات التي يختارها الطلاب حول العالم</p>
          </div>
          
          {popularLoading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
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
          ) : popularError ? (
            <div className="text-center text-red-600 py-8">
              <p>حدث خطأ في تحميل الدورات الشائعة</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {popularCourses?.slice(0, 6).map((course) => (
                <div key={course._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
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
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link
                        to={`/courses/${course._id}`}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-center block"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              عرض جميع الدورات
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-xl opacity-90">طالب نشط</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{popularCourses?.length || 50}+</div>
              <div className="text-xl opacity-90">دورة تدريبية</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">20+</div>
              <div className="text-xl opacity-90">مدرب خبير</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-xl opacity-90">معدل الرضا</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            هل أنت مستعد لبدء رحلتك التعليمية؟
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            انضم إلى آلاف الطلاب الذين يطورون مهاراتهم معنا يومياً
          </p>
          {!isAuthenticated && (
            <button
              onClick={login}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              سجل الآن مجاناً
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
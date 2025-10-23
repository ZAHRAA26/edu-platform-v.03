import mongoose from 'mongoose';
import { config, validateConfig } from '../config/environment';
import User from '../models/User.model';
import Course from '../models/Course.model';
import Lesson from '../models/Lesson.model';
import logger from '../config/logger';

// Validate configuration before seeding
validateConfig();

// Sample data for seeding
const seedData = {
  // Admin user data
  adminUser: {
    username: config.admin.defaultUsername,
    email: config.admin.defaultEmail,
    auth0Id: 'seed-admin-auth0-id', // This will be replaced when real admin logs in
    name: config.admin.defaultName,
    picture: 'https://via.placeholder.com/150/0066cc/ffffff?text=Admin',
    roles: ['admin', 'teacher', 'student'],
    isDisabled: false,
    lastLoginAt: new Date(),
  },

  // Sample teacher user
  teacherUser: {
    username: 'teacher1',
    email: 'teacher@edu-platform.com',
    auth0Id: 'seed-teacher-auth0-id',
    name: 'أستاذ محمد أحمد',
    picture: 'https://via.placeholder.com/150/00cc66/ffffff?text=Teacher',
    roles: ['teacher', 'student'],
    isDisabled: false,
    lastLoginAt: new Date(),
  },

  // Sample student user
  studentUser: {
    username: 'student1',
    email: 'student@edu-platform.com',
    auth0Id: 'seed-student-auth0-id',
    name: 'الطالب أحمد محمد',
    picture: 'https://via.placeholder.com/150/cc6600/ffffff?text=Student',
    roles: ['student'],
    isDisabled: false,
    lastLoginAt: new Date(),
  },

  // Sample courses
  courses: [
    {
      title: 'مقدمة في البرمجة',
      description: 'تعلم أساسيات البرمجة باستخدام JavaScript',
      category: 'البرمجة',
      level: 'مبتدئ',
      duration: 40,
      price: 299,
      thumbnail: 'https://via.placeholder.com/400x300/0066cc/ffffff?text=JavaScript',
      tags: ['javascript', 'programming', 'web-development'],
      isPublished: true,
      maxStudents: 100,
    },
    {
      title: 'تطوير تطبيقات الويب',
      description: 'تعلم تطوير تطبيقات الويب الحديثة باستخدام React',
      category: 'تطوير الويب',
      level: 'متوسط',
      duration: 60,
      price: 499,
      thumbnail: 'https://via.placeholder.com/400x300/00cc66/ffffff?text=React',
      tags: ['react', 'frontend', 'web-development'],
      isPublished: true,
      maxStudents: 50,
    },
    {
      title: 'قواعد البيانات',
      description: 'تعلم تصميم وإدارة قواعد البيانات',
      category: 'قواعد البيانات',
      level: 'متقدم',
      duration: 45,
      price: 399,
      thumbnail: 'https://via.placeholder.com/400x300/cc6600/ffffff?text=Database',
      tags: ['database', 'sql', 'mongodb'],
      isPublished: true,
      maxStudents: 30,
    },
  ],

  // Sample lessons for each course
  lessons: [
    // JavaScript Course Lessons
    {
      title: 'مقدمة في JavaScript',
      description: 'تعرف على أساسيات لغة JavaScript',
      content: 'في هذا الدرس سنتعلم أساسيات JavaScript...',
      duration: 15,
      order: 1,
      isPublished: true,
      videoUrl: 'https://example.com/video1.mp4',
      resources: ['https://example.com/resource1.pdf'],
    },
    {
      title: 'المتغيرات والأنواع',
      description: 'تعلم كيفية استخدام المتغيرات في JavaScript',
      content: 'المتغيرات هي أساس أي لغة برمجة...',
      duration: 20,
      order: 2,
      isPublished: true,
      videoUrl: 'https://example.com/video2.mp4',
      resources: ['https://example.com/resource2.pdf'],
    },
    // React Course Lessons
    {
      title: 'مقدمة في React',
      description: 'تعرف على مكتبة React',
      content: 'React هي مكتبة JavaScript لبناء واجهات المستخدم...',
      duration: 25,
      order: 1,
      isPublished: true,
      videoUrl: 'https://example.com/video3.mp4',
      resources: ['https://example.com/resource3.pdf'],
    },
    // Database Course Lessons
    {
      title: 'مقدمة في قواعد البيانات',
      description: 'تعرف على مفاهيم قواعد البيانات',
      content: 'قواعد البيانات هي أساس أي تطبيق...',
      duration: 30,
      order: 1,
      isPublished: true,
      videoUrl: 'https://example.com/video4.mp4',
      resources: ['https://example.com/resource4.pdf'],
    },
  ],
};

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(config.database.mongoUri, config.database.options);
    logger.info('✅ Connected to MongoDB for seeding');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    logger.info('🗑️  Cleared existing data');
  } catch (error) {
    logger.error('❌ Error clearing data:', error);
    throw error;
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = await User.insertMany([
      seedData.adminUser,
      seedData.teacherUser,
      seedData.studentUser,
    ]);
    
    logger.info(`✅ Created ${users.length} users`);
    return users;
  } catch (error) {
    logger.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Seed courses
const seedCourses = async (users: any[]) => {
  try {
    const adminUser = users.find(user => user.roles.includes('admin'));
    const teacherUser = users.find(user => user.roles.includes('teacher') && !user.roles.includes('admin'));
    
    const coursesWithInstructor = seedData.courses.map((course, index) => ({
      ...course,
      instructor: index === 0 ? adminUser._id : teacherUser._id,
      createdBy: adminUser._id,
      updatedBy: adminUser._id,
    }));

    const courses = await Course.insertMany(coursesWithInstructor);
    logger.info(`✅ Created ${courses.length} courses`);
    return courses;
  } catch (error) {
    logger.error('❌ Error seeding courses:', error);
    throw error;
  }
};

// Seed lessons
const seedLessons = async (courses: any[]) => {
  try {
    const lessonsWithCourse = [];
    
    // Assign lessons to courses
    seedData.lessons.forEach((lesson, index) => {
      const courseIndex = Math.floor(index / 2); // 2 lessons per course approximately
      const course = courses[courseIndex] || courses[0];
      
      lessonsWithCourse.push({
        ...lesson,
        course: course._id,
        createdBy: course.instructor,
        updatedBy: course.instructor,
      });
    });

    const lessons = await Lesson.insertMany(lessonsWithCourse);
    logger.info(`✅ Created ${lessons.length} lessons`);
    return lessons;
  } catch (error) {
    logger.error('❌ Error seeding lessons:', error);
    throw error;
  }
};

// Update courses with lesson counts
const updateCoursesWithLessons = async (courses: any[], lessons: any[]) => {
  try {
    for (const course of courses) {
      const courseLessons = lessons.filter(lesson => 
        lesson.course.toString() === course._id.toString()
      );
      
      await Course.findByIdAndUpdate(course._id, {
        lessonsCount: courseLessons.length,
        totalDuration: courseLessons.reduce((total, lesson) => total + lesson.duration, 0),
      });
    }
    
    logger.info('✅ Updated courses with lesson information');
  } catch (error) {
    logger.error('❌ Error updating courses:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearData();
    
    // Seed data in order
    const users = await seedUsers();
    const courses = await seedCourses(users);
    const lessons = await seedLessons(courses);
    
    // Update relationships
    await updateCoursesWithLessons(courses, lessons);
    
    logger.info('🎉 Database seeding completed successfully!');
    logger.info('📊 Seeded data summary:');
    logger.info(`   - Users: ${users.length}`);
    logger.info(`   - Courses: ${courses.length}`);
    logger.info(`   - Lessons: ${lessons.length}`);
    
    logger.info('👤 Default accounts created:');
    logger.info(`   - Admin: ${config.admin.defaultEmail} (roles: admin, teacher, student)`);
    logger.info(`   - Teacher: teacher@edu-platform.com (roles: teacher, student)`);
    logger.info(`   - Student: student@edu-platform.com (roles: student)`);
    
    logger.info('⚠️  Note: Auth0 IDs are temporary. They will be updated when users log in through Auth0.');
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { sendValidationError } from './api-response';

// Middleware to handle validation results
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return sendValidationError(res, errorMessages);
  }
  next();
};

// Common validation rules
export const validationRules = {
  // User validation
  user: {
    create: [
      body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
      body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
      body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      body('roles')
        .optional()
        .isArray()
        .withMessage('Roles must be an array')
        .custom((roles) => {
          const validRoles = ['admin', 'teacher', 'student'];
          return roles.every((role: string) => validRoles.includes(role));
        })
        .withMessage('Invalid role provided'),
    ],
    update: [
      body('username')
        .optional()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
      body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
      body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      body('roles')
        .optional()
        .isArray()
        .withMessage('Roles must be an array')
        .custom((roles) => {
          const validRoles = ['admin', 'teacher', 'student'];
          return roles.every((role: string) => validRoles.includes(role));
        })
        .withMessage('Invalid role provided'),
    ],
  },

  // Course validation
  course: {
    create: [
      body('title')
        .isLength({ min: 5, max: 200 })
        .withMessage('Course title must be between 5 and 200 characters'),
      body('description')
        .isLength({ min: 20, max: 2000 })
        .withMessage('Course description must be between 20 and 2000 characters'),
      body('category')
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),
      body('level')
        .isIn(['مبتدئ', 'متوسط', 'متقدم', 'beginner', 'intermediate', 'advanced'])
        .withMessage('Level must be one of: مبتدئ, متوسط, متقدم, beginner, intermediate, advanced'),
      body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
      body('duration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive integer'),
      body('maxStudents')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Max students must be a positive integer'),
      body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    ],
    update: [
      body('title')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Course title must be between 5 and 200 characters'),
      body('description')
        .optional()
        .isLength({ min: 20, max: 2000 })
        .withMessage('Course description must be between 20 and 2000 characters'),
      body('category')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),
      body('level')
        .optional()
        .isIn(['مبتدئ', 'متوسط', 'متقدم', 'beginner', 'intermediate', 'advanced'])
        .withMessage('Level must be one of: مبتدئ, متوسط, متقدم, beginner, intermediate, advanced'),
      body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
      body('duration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive integer'),
      body('maxStudents')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Max students must be a positive integer'),
      body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    ],
  },

  // Lesson validation
  lesson: {
    create: [
      body('title')
        .isLength({ min: 5, max: 200 })
        .withMessage('Lesson title must be between 5 and 200 characters'),
      body('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Lesson description must be between 10 and 1000 characters'),
      body('content')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Lesson content must be at least 10 characters'),
      body('duration')
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive integer'),
      body('order')
        .isInt({ min: 1 })
        .withMessage('Order must be a positive integer'),
      body('course')
        .isMongoId()
        .withMessage('Course ID must be a valid MongoDB ObjectId'),
    ],
    update: [
      body('title')
        .optional()
        .isLength({ min: 5, max: 200 })
        .withMessage('Lesson title must be between 5 and 200 characters'),
      body('description')
        .optional()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Lesson description must be between 10 and 1000 characters'),
      body('content')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Lesson content must be at least 10 characters'),
      body('duration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive integer'),
      body('order')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Order must be a positive integer'),
    ],
  },

  // Rating validation
  rating: {
    create: [
      body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
      body('comment')
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage('Comment must be between 10 and 500 characters'),
      body('course')
        .isMongoId()
        .withMessage('Course ID must be a valid MongoDB ObjectId'),
    ],
    update: [
      body('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
      body('comment')
        .optional()
        .isLength({ min: 10, max: 500 })
        .withMessage('Comment must be between 10 and 500 characters'),
    ],
  },

  // Common parameter validations
  params: {
    mongoId: [
      param('id')
        .isMongoId()
        .withMessage('ID must be a valid MongoDB ObjectId'),
    ],
    userId: [
      param('userId')
        .isMongoId()
        .withMessage('User ID must be a valid MongoDB ObjectId'),
    ],
    courseId: [
      param('courseId')
        .isMongoId()
        .withMessage('Course ID must be a valid MongoDB ObjectId'),
    ],
    lessonId: [
      param('lessonId')
        .isMongoId()
        .withMessage('Lesson ID must be a valid MongoDB ObjectId'),
    ],
  },

  // Query parameter validations
  query: {
    pagination: [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    ],
    search: [
      query('search')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Search term must be between 2 and 100 characters'),
    ],
    sort: [
      query('sortBy')
        .optional()
        .isAlpha()
        .withMessage('Sort field must contain only letters'),
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be either asc or desc'),
    ],
  },
};

// Helper function to combine validation rules
export const combineValidations = (...validations: any[][]) => {
  return validations.flat();
};

// Custom validation helpers
export const customValidations = {
  // Check if user has required role
  hasRole: (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRoles = req.user?.roles || [];
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        return sendValidationError(res, [`User must have one of these roles: ${requiredRoles.join(', ')}`]);
      }
      
      next();
    };
  },

  // Check if user owns the resource or is admin
  isOwnerOrAdmin: (resourceUserField: string = 'user') => {
    return (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.sub;
      const userRoles = req.user?.roles || [];
      const resourceUserId = req.body[resourceUserField] || req.params.userId;
      
      if (userRoles.includes('admin') || userId === resourceUserId) {
        return next();
      }
      
      return sendValidationError(res, ['You can only access your own resources']);
    };
  },
};
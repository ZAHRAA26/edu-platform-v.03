import { Response } from 'express';

// Standard API response interface
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

// Success response helper
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200,
  meta?: ApiResponse['meta']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// Error response helper
export const sendError = (
  res: Response,
  message: string = 'Operation failed',
  statusCode: number = 400,
  error?: string,
  errors?: string[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (error) {
    response.error = error;
  }

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

// Validation error response
export const sendValidationError = (
  res: Response,
  errors: string[],
  message: string = 'Validation failed'
): Response => {
  return sendError(res, message, 422, undefined, errors);
};

// Not found response
export const sendNotFound = (
  res: Response,
  resource: string = 'Resource'
): Response => {
  return sendError(res, `${resource} not found`, 404);
};

// Unauthorized response
export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized access'
): Response => {
  return sendError(res, message, 401);
};

// Forbidden response
export const sendForbidden = (
  res: Response,
  message: string = 'Access forbidden'
): Response => {
  return sendError(res, message, 403);
};

// Server error response
export const sendServerError = (
  res: Response,
  message: string = 'Internal server error',
  error?: string
): Response => {
  return sendError(res, message, 500, error);
};

// Created response
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return sendSuccess(res, data, message, 201);
};

// No content response
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

// Paginated response helper
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Data retrieved successfully'
): Response => {
  const totalPages = Math.ceil(total / limit);
  
  return sendSuccess(res, data, message, 200, {
    page,
    limit,
    total,
    totalPages,
  });
};

// Helper to extract pagination parameters from query
export const getPaginationParams = (query: any) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
};

// Helper to extract sort parameters from query
export const getSortParams = (query: any, defaultSort: string = 'createdAt') => {
  const sortBy = query.sortBy || defaultSort;
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
  
  return { [sortBy]: sortOrder };
};

// Helper to extract search parameters
export const getSearchParams = (query: any, searchFields: string[] = []) => {
  const search = query.search;
  if (!search || searchFields.length === 0) {
    return {};
  }
  
  return {
    $or: searchFields.map(field => ({
      [field]: { $regex: search, $options: 'i' }
    }))
  };
};
// Response Utilities
// Standardized API response formats

import { Response } from 'express';

 // Success response format
export const successResponse = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

//Error response format
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: any
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

//Paginated response format
export const paginatedResponse = (
  res: Response,
  data: any[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

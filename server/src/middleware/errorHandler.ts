// Global Error Handler Middleware
// Catches all errors and sends appropriate responses

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { NODE_ENV } from '../config/env';

/**
 * Global error handling middleware
 * Must be the last middleware in the chain
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error in development
  if (NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Handle operational errors (AppError instances)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      message: 'Database operation failed',
      ...(NODE_ENV === 'development' && { error: err.message }),
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(NODE_ENV === 'development' && { error: err.message, stack: err.stack }),
  });
};

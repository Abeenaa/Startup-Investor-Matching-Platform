// Authentication Middleware
// Verifies JWT token and attaches user info to request

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../shared/utils/jwt';
import { UnauthorizedError } from '../shared/errors/AppError';

/**
 * Middleware to authenticate requests using JWT
 * Extracts token from Authorization header and verifies it
 * Attaches user info to req.user if valid
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];

    // Verify token and get payload
    const payload = verifyAccessToken(token);

    // Attach user info to request
    req.user = payload;

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

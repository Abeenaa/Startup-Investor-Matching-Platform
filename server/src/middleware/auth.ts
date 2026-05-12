// Authentication Middleware
// Verifies JWT token and attaches user info to request
// Enhanced with government-level security features

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../shared/utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../shared/errors/AppError';
import prisma from '../database/prisma';

/**
 * Enhanced authentication middleware with security checks
 * Extracts token from Authorization header and verifies it
 * Attaches user info to req.user if valid
 * Includes additional security validations
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

    // Additional security check: verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        startup: {
          select: {
            id: true,
          },
        },
        investor: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Account has been deactivated');
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      startup: user.startup,
      investor: user.investor,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
};

/**
 * Optional authentication - doesn't throw error if no token
 * Used for endpoints that work for both authenticated and anonymous users
 */
export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyAccessToken(token);

      // Verify user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    }

    next();
  } catch (error) {
    // Don't throw error for optional auth, just continue without user
    next();
  }
};

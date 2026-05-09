// Authorization Middleware
// Checks if authenticated user has required role(s)

import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../shared/errors/AppError';
import { UserRole } from '../shared/constants/roles';

/**
 * Middleware to authorize requests based on user role
 * Must be used after authenticate middleware
 * @param allowedRoles - Array of roles that can access the route
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(req.user.role as UserRole)) {
        throw new ForbiddenError('You do not have permission to access this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

//Shorthand middleware for staff admin only routes (highest privilege)
export const staffAdminOnly = authorize([UserRole.STAFF_ADMIN]);

//Shorthand middleware for system admin only routes
export const systemAdminOnly = authorize([UserRole.SYSTEM_ADMIN]);

//Shorthand middleware for any admin routes
export const adminOnly = authorize([UserRole.SYSTEM_ADMIN, UserRole.STAFF_ADMIN]);

//Shorthand middleware for reviewer routes
export const reviewerOnly = authorize([UserRole.REVIEWER]);

 //Middleware for routes accessible by staff admin and reviewers
export const staffAdminOrReviewer = authorize([UserRole.STAFF_ADMIN, UserRole.REVIEWER]);

//Middleware for routes accessible by any admin and reviewer
export const adminOrReviewer = authorize([UserRole.SYSTEM_ADMIN, UserRole.STAFF_ADMIN, UserRole.REVIEWER]);

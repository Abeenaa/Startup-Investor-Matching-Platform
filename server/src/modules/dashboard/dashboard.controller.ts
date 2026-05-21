// Handles dashboard HTTP requests

import { Request, Response, NextFunction } from 'express';
import * as dashboardService from './dashboard.service';
import { successResponse } from '../../shared/utils/response';

// Mock user ID for testing - replace with actual authentication when needed
const TEST_USER_ID = 'test-user-id-123';

/**
 * GET /api/dashboard/startup
 * Get startup dashboard data
 */
export const getStartupDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use test user ID instead of req.user.id
    const userId = TEST_USER_ID;

    const dashboard = await dashboardService.getStartupDashboard(userId);

    successResponse(res, dashboard, 'Startup dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/investor
 * Get investor dashboard data
 */
export const getInvestorDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use test user ID instead of req.user.id
    const userId = TEST_USER_ID;

    const dashboard = await dashboardService.getInvestorDashboard(userId);

    successResponse(res, dashboard, 'Investor dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/reviewer
 * Get reviewer dashboard data
 */
export const getReviewerDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Use test user ID instead of req.user.id
    const userId = TEST_USER_ID;

    const dashboard = await dashboardService.getReviewerDashboard(userId);

    successResponse(res, dashboard, 'Reviewer dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/staff-admin
 * Get staff admin dashboard data
 */
export const getStaffAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Staff admin dashboard doesn't require user ID
    const dashboard = await dashboardService.getStaffAdminDashboard();

    successResponse(res, dashboard, 'Staff admin dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/system-admin
 * Get system admin dashboard data
 */
export const getSystemAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // System admin dashboard doesn't require user ID
    const dashboard = await dashboardService.getSystemAdminDashboard();

    successResponse(res, dashboard, 'System admin dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

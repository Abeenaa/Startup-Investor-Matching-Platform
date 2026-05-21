// Routes for dashboard endpoints

import { Router } from 'express';
// import { authenticate } from '../../middleware/auth';
// import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../shared/constants/roles';
import * as dashboardController from './dashboard.controller';
import * as dashboardValidation from './dashboard.validation';

const router = Router();

/**
 * GET /api/dashboard/startup
 * Get startup dashboard (Startup only)
 */
router.get(
  '/startup',
  // authenticate,
  // authorize([UserRole.STARTUP]),
  validate(dashboardValidation.getStartupDashboardSchema),
  dashboardController.getStartupDashboard
);

/**
 * GET /api/dashboard/investor
 * Get investor dashboard (Investor only)
 */
router.get(
  '/investor',
  // authenticate,
  // authorize([UserRole.INVESTOR]),
  validate(dashboardValidation.getInvestorDashboardSchema),
  dashboardController.getInvestorDashboard
);

/**
 * GET /api/dashboard/reviewer
 * Get reviewer dashboard (Reviewer only)
 */
router.get(
  '/reviewer',
  // authenticate,
  // authorize([UserRole.REVIEWER]),
  validate(dashboardValidation.getReviewerDashboardSchema),
  dashboardController.getReviewerDashboard
);

/**
 * GET /api/dashboard/staff-admin
 * Get staff admin dashboard (Staff Admin only)
 */
router.get(
  '/staff-admin',
  // authenticate,
  // authorize([UserRole.STAFF_ADMIN]),
  validate(dashboardValidation.getStaffAdminDashboardSchema),
  dashboardController.getStaffAdminDashboard
);

/**
 * GET /api/dashboard/system-admin
 * Get system admin dashboard (System Admin only)
 */
router.get(
  '/system-admin',
  // authenticate,
  // authorize([UserRole.SYSTEM_ADMIN]),
  validate(dashboardValidation.getSystemAdminDashboardSchema),
  dashboardController.getSystemAdminDashboard
);

export default router;

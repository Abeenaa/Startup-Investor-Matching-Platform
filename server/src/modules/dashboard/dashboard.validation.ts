// Zod schemas for dashboard validation

import { z } from 'zod';

/**
 * Validation for startup dashboard
 * GET /api/dashboard/startup
 * No parameters required - uses authenticated user's ID
 */
export const getStartupDashboardSchema = z.object({
  // No query params or body - just authentication
  query: z.object({}).optional(),
});

/**
 * Validation for investor dashboard
 * GET /api/dashboard/investor
 * No parameters required - uses authenticated user's ID
 */
export const getInvestorDashboardSchema = z.object({
  query: z.object({}).optional(),
});

/**
 * Validation for reviewer dashboard
 * GET /api/dashboard/reviewer
 * No parameters required - uses authenticated user's ID
 */
export const getReviewerDashboardSchema = z.object({
  query: z.object({}).optional(),
});

/**
 * Validation for staff admin dashboard
 * GET /api/dashboard/staff-admin
 * No parameters required - aggregates system-wide data
 */
export const getStaffAdminDashboardSchema = z.object({
  query: z.object({}).optional(),
});

/**
 * Validation for system admin dashboard
 * GET /api/dashboard/system-admin
 * No parameters required - aggregates system-wide data
 */
export const getSystemAdminDashboardSchema = z.object({
  query: z.object({}).optional(),
});

// Future enhancement: Add optional filters
// Example for when we add date range filters:
/*
export const getStartupDashboardSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    programType: z.enum(['FUNDING', 'INCUBATION', 'ACCELERATION', 'COMPETITION', 'MENTORSHIP', 'WORKSPACE', 'TRAINING']).optional(),
  }).optional(),
});
*/

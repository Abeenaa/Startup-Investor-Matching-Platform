// Admin Routes
// API endpoints for system admin user management operations
// Enhanced with government-level security features

import { Router } from 'express';
import * as adminController from './admin.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { systemAdminOnly, staffAdminOnly, adminOnly } from '../../middleware/authorize';
import { adminRateLimit } from '../../middleware/security';
import {
  createUserSchema,
  updateUserSchema,
  getUsersSchema,
  assignReviewersSchema,
  deleteUserSchema,
} from './admin.validation';

const router = Router();

// Apply admin rate limiting to all routes
router.use(adminRateLimit);

// User Management
// POST /api/admin/users - Create users (SYSTEM_ADMIN only)
router.post(
  '/users',
  authenticate,
  systemAdminOnly,
  validate(createUserSchema),
  adminController.createUser
);

// GET /api/admin/users - Get all users with filtering (SYSTEM_ADMIN only)
router.get(
  '/users',
  authenticate,
  systemAdminOnly,
  validate(getUsersSchema),
  adminController.getUsers
);

// PATCH /api/admin/users/:userId - Update user (SYSTEM_ADMIN only)
router.patch(
  '/users/:userId',
  authenticate,
  systemAdminOnly,
  validate(updateUserSchema),
  adminController.updateUser
);

// DELETE /api/admin/users/:userId - Delete/deactivate user (SYSTEM_ADMIN only for safety)
router.delete(
  '/users/:userId',
  authenticate,
  systemAdminOnly,  // Keep as systemAdminOnly - deleting users is sensitive
  validate(deleteUserSchema),
  adminController.deleteUser
);

// Reviewer Management (Staff Admin Only - business operations)
// POST /api/admin/assign-reviewers - Assign reviewers to applications
router.post(
  '/assign-reviewers',
  authenticate,
  staffAdminOnly,
  validate(assignReviewersSchema),
  adminController.assignReviewers
);

// GET /api/admin/reviewer-assignments - Get all reviewer assignments
router.get(
  '/reviewer-assignments',
  authenticate,
  staffAdminOnly,
  adminController.getReviewerAssignments
);

export default router;
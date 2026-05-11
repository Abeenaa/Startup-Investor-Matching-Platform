// Admin Routes
// API endpoints for staff admin user management operations
// Enhanced with government-level security features

import { Router } from 'express';
import * as adminController from './admin.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { staffAdminOnly } from '../../middleware/authorize';
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

// User Management (Staff Admin Only)
// POST /api/admin/users - Create system admin or reviewer
router.post(
  '/users',
  authenticate,
  staffAdminOnly,
  validate(createUserSchema),
  adminController.createUser
);

// GET /api/admin/users - Get all users with filtering
router.get(
  '/users',
  authenticate,
  staffAdminOnly,
  validate(getUsersSchema),
  adminController.getUsers
);

// PATCH /api/admin/users/:userId - Update user
router.patch(
  '/users/:userId',
  authenticate,
  staffAdminOnly,
  validate(updateUserSchema),
  adminController.updateUser
);

// DELETE /api/admin/users/:userId - Delete/deactivate user
router.delete(
  '/users/:userId',
  authenticate,
  staffAdminOnly,
  validate(deleteUserSchema),
  adminController.deleteUser
);

// Reviewer Management
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
// Startup Routes
// API endpoints for startup profile management

import { Router } from 'express';
import * as startupController from './startups.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authorize, adminOnly } from '../../middleware/authorize';
import { UserRole } from '../../shared/constants/roles';
import {
  createStartupProfileSchema,
  updateStartupProfileSchema,
  getStartupsSchema,
  approveStartupSchema,
  rejectStartupSchema,
} from './startups.validation';

const router = Router();

// ─── Startup User Routes ─────────────────────────────────────────────────────

// POST /api/startups/profile - Create startup profile
router.post(
  '/profile',
  authenticate,
  authorize([UserRole.STARTUP]),
  validate(createStartupProfileSchema),
  startupController.createProfile
);

// GET /api/startups/profile - Get my startup profile
router.get(
  '/profile',
  authenticate,
  authorize([UserRole.STARTUP]),
  startupController.getMyProfile
);

// PATCH /api/startups/profile - Update my startup profile
router.patch(
  '/profile',
  authenticate,
  authorize([UserRole.STARTUP]),
  validate(updateStartupProfileSchema),
  startupController.updateProfile
);

// ─── Admin Routes ────────────────────────────────────────────────────────────

// GET /api/startups - Get all startups (admin/reviewer)
router.get(
  '/',
  authenticate,
  authorize([UserRole.SYSTEM_ADMIN, UserRole.STAFF_ADMIN, UserRole.REVIEWER]),
  validate(getStartupsSchema),
  startupController.getStartups
);

// GET /api/startups/:startupId - Get startup by ID (admin/reviewer)
router.get(
  '/:startupId',
  authenticate,
  authorize([UserRole.SYSTEM_ADMIN, UserRole.STAFF_ADMIN, UserRole.REVIEWER]),
  startupController.getStartupById
);

// PATCH /api/startups/:startupId/approve - Approve startup (admin only)
router.patch(
  '/:startupId/approve',
  authenticate,
  adminOnly,
  validate(approveStartupSchema),
  startupController.approveStartup
);

// PATCH /api/startups/:startupId/reject - Reject startup (admin only)
router.patch(
  '/:startupId/reject',
  authenticate,
  adminOnly,
  validate(rejectStartupSchema),
  startupController.rejectStartup
);

export default router;
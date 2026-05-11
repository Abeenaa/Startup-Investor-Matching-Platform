// Investor Routes
// API endpoints for investor profile management

import { Router } from 'express';
import * as investorController from './investors.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authorize, staffAdminOnly } from '../../middleware/authorize';
import { UserRole } from '../../shared/constants/roles';
import {
  createInvestorProfileSchema,
  updateInvestorProfileSchema,
  getInvestorsSchema,
  approveInvestorSchema,
} from './investors.validation';

const router = Router();

// Investor User Routes 
// POST /api/investors/profile - Create investor profile
router.post(
  '/profile',
  authenticate,
  authorize([UserRole.INVESTOR]),
  validate(createInvestorProfileSchema),
  investorController.createProfile
);

// GET /api/investors/profile - Get my investor profile
router.get(
  '/profile',
  authenticate,
  authorize([UserRole.INVESTOR]),
  investorController.getMyProfile
);

// PATCH /api/investors/profile - Update my investor profile
router.patch(
  '/profile',
  authenticate,
  authorize([UserRole.INVESTOR]),
  validate(updateInvestorProfileSchema),
  investorController.updateProfile
);

// Admin Routes
// GET /api/investors - Get all investors (staff admin/reviewer)
router.get(
  '/',
  authenticate,
  authorize([UserRole.STAFF_ADMIN, UserRole.REVIEWER]),
  validate(getInvestorsSchema),
  investorController.getInvestors
);

// GET /api/investors/:investorId - Get investor by ID (staff admin/reviewer)
router.get(
  '/:investorId',
  authenticate,
  authorize([UserRole.STAFF_ADMIN, UserRole.REVIEWER]),
  investorController.getInvestorById
);

// PATCH /api/investors/:investorId/approve - Approve investor (staff admin only)
router.patch(
  '/:investorId/approve',
  authenticate,
  staffAdminOnly,
  validate(approveInvestorSchema),
  investorController.approveInvestor
);

export default router;
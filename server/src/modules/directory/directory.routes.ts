// Public directory API endpoints

import { Router } from 'express';
import * as directoryController from './directory.controller';
import { validate } from '../../middleware/validate';
import {
  searchStartupsSchema,
  searchInvestorsSchema,
  getStartupByIdSchema,
  getInvestorByIdSchema,
} from './directory.validation';

const router = Router();

// ============================================
// STARTUP DIRECTORY ROUTES (PUBLIC)
// ============================================

// GET /api/directory/startups - Search and browse approved startups
// Query params: search, sector, stage, page, limit
// Public access - no authentication required
router.get(
  '/startups',
  validate(searchStartupsSchema),
  directoryController.searchStartups
);

// GET /api/directory/startups/:startupId - Get single startup details
// Public access - no authentication required
router.get(
  '/startups/:startupId',
  validate(getStartupByIdSchema),
  directoryController.getStartupById
);

// ============================================
// INVESTOR DIRECTORY ROUTES (PUBLIC)
// ============================================

// GET /api/directory/investors - Search and browse approved investors
// Query params: search, sector, investmentStage, page, limit
// Public access - no authentication required
router.get(
  '/investors',
  validate(searchInvestorsSchema),
  directoryController.searchInvestors
);

// GET /api/directory/investors/:investorId - Get single investor details
// Public access - no authentication required
router.get(
  '/investors/:investorId',
  validate(getInvestorByIdSchema),
  directoryController.getInvestorById
);

export default router;

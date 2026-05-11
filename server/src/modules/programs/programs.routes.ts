// Program management API endpoints

import { Router } from 'express';
import * as programsController from './programs.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { staffAdminOnly } from '../../middleware/authorize';
import {
  createProgramSchema,
  updateProgramSchema,
  listProgramsSchema,
  getProgramByIdSchema,
  deleteProgramSchema,
  closeProgramSchema,
} from './programs.validation';

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// GET /api/programs - List active programs
// Query params: type, page, limit
router.get(
  '/',
  validate(listProgramsSchema),
  programsController.listPrograms
);

// GET /api/programs/:programId - Get single program details
router.get(
  '/:programId',
  validate(getProgramByIdSchema),
  programsController.getProgramById
);

// ============================================
// STAFF ADMIN ROUTES
// ============================================

// POST /api/programs - Create new program
router.post(
  '/',
  authenticate,
  staffAdminOnly,
  validate(createProgramSchema),
  programsController.createProgram
);

// PATCH /api/programs/:programId - Update program
router.patch(
  '/:programId',
  authenticate,
  staffAdminOnly,
  validate(updateProgramSchema),
  programsController.updateProgram
);

// DELETE /api/programs/:programId - Delete program
router.delete(
  '/:programId',
  authenticate,
  staffAdminOnly,
  validate(deleteProgramSchema),
  programsController.deleteProgram
);

// PATCH /api/programs/:programId/close - Close program early
router.patch(
  '/:programId/close',
  authenticate,
  staffAdminOnly,
  validate(closeProgramSchema),
  programsController.closeProgram
);

export default router;

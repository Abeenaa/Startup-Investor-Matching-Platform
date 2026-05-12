// Routes for evaluations management

import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { UserRole } from '../../shared/constants/roles';
import * as evaluationsController from './evaluations.controller';
import * as evaluationsValidation from './evaluations.validation';

const router = Router();

/**
 * POST /api/evaluations
 * Create evaluation (Reviewer only)
 */
router.post(
  '/',
  authenticate,
  authorize([UserRole.REVIEWER]),
  validate(evaluationsValidation.createEvaluationSchema),
  evaluationsController.createEvaluation
);

/**
 * PATCH /api/evaluations/:evaluationId
 * Update evaluation (Reviewer only)
 */
router.patch(
  '/:evaluationId',
  authenticate,
  authorize([UserRole.REVIEWER]),
  validate(evaluationsValidation.updateEvaluationSchema),
  evaluationsController.updateEvaluation
);

/**
 * GET /api/evaluations/my-assignments
 * Get my assigned applications (Reviewer only)
 */
router.get(
  '/my-assignments',
  authenticate,
  authorize([UserRole.REVIEWER]),
  validate(evaluationsValidation.getMyAssignmentsSchema),
  evaluationsController.getMyAssignments
);

/**
 * GET /api/evaluations/application/:applicationId
 * Get all evaluations for an application (Staff Admin only)
 */
router.get(
  '/application/:applicationId',
  authenticate,
  authorize([UserRole.STAFF_ADMIN]),
  evaluationsController.getApplicationEvaluations
);

/**
 * GET /api/evaluations/:evaluationId
 * Get single evaluation (Reviewer/Staff Admin)
 */
router.get(
  '/:evaluationId',
  authenticate,
  authorize([UserRole.REVIEWER, UserRole.STAFF_ADMIN]),
  evaluationsController.getEvaluationById
);

/**
 * DELETE /api/evaluations/:evaluationId
 * Delete evaluation (Reviewer only)
 */
router.delete(
  '/:evaluationId',
  authenticate,
  authorize([UserRole.REVIEWER]),
  evaluationsController.deleteEvaluation
);

export default router;

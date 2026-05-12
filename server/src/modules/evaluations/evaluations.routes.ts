// Routes for evaluations management

import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
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
  authorize(['REVIEWER']),
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
  authorize(['REVIEWER']),
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
  authorize(['REVIEWER']),
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
  authorize(['STAFF_ADMIN']),
  evaluationsController.getApplicationEvaluations
);

/**
 * GET /api/evaluations/:evaluationId
 * Get single evaluation (Reviewer/Staff Admin)
 */
router.get(
  '/:evaluationId',
  authenticate,
  authorize(['REVIEWER', 'STAFF_ADMIN']),
  evaluationsController.getEvaluationById
);

/**
 * DELETE /api/evaluations/:evaluationId
 * Delete evaluation (Reviewer only)
 */
router.delete(
  '/:evaluationId',
  authenticate,
  authorize(['REVIEWER']),
  evaluationsController.deleteEvaluation
);

export default router;

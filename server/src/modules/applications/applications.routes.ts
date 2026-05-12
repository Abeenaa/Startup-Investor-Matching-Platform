// Application submission API endpoints

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as applicationsController from './applications.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authorize, staffAdminOnly } from '../../middleware/authorize';
import { UserRole } from '../../shared/constants/roles';
import {
  createApplicationSchema,
  updateApplicationSchema,
  submitApplicationSchema,
  listApplicationsSchema,
  getApplicationByIdSchema,
  deleteApplicationSchema,
  approveApplicationSchema,
  rejectApplicationSchema,
} from './applications.validation';

const router = Router();

// Rate limiter for application creation (prevent spam)
const applicationCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 applications per 15 minutes per IP
  message: 'Too many applications created. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for application submission (prevent spam)
const applicationSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 submissions per hour per IP
  message: 'Too many application submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// STARTUP ROUTES
// ============================================

// POST /api/applications - Create draft application
router.post(
  '/',
  applicationCreationLimiter, // Rate limit: 5 per 15 minutes
  authenticate,
  authorize([UserRole.STARTUP]),
  validate(createApplicationSchema),
  applicationsController.createApplication
);

// GET /api/applications/my-applications - Get my applications
router.get(
  '/my-applications',
  authenticate,
  authorize([UserRole.STARTUP]),
  validate(listApplicationsSchema),
  applicationsController.getMyApplications
);

// PATCH /api/applications/:applicationId - Update draft application
router.patch(
  '/:applicationId',
  authenticate,
  authorize([UserRole.STARTUP]),
  validate(updateApplicationSchema),
  applicationsController.updateApplication
);

// POST /api/applications/:applicationId/submit - Submit draft application
router.post(
  '/:applicationId/submit',
  applicationSubmissionLimiter, // Rate limit: 10 per hour
  authenticate,
  authorize([UserRole.STARTUP]),
  validate(submitApplicationSchema),
  applicationsController.submitApplication
);

// DELETE /api/applications/:applicationId - Delete draft application
router.delete(
  '/:applicationId',
  authenticate,
  authorize([UserRole.STARTUP]),
  validate(deleteApplicationSchema),
  applicationsController.deleteApplication
);

// ============================================
// STAFF ADMIN ROUTES
// ============================================

// GET /api/applications - List all applications (with filters)
router.get(
  '/',
  authenticate,
  staffAdminOnly,
  validate(listApplicationsSchema),
  applicationsController.listAllApplications
);

// PATCH /api/applications/:applicationId/approve - Approve application
router.patch(
  '/:applicationId/approve',
  authenticate,
  staffAdminOnly,
  validate(approveApplicationSchema),
  applicationsController.approveApplication
);

// PATCH /api/applications/:applicationId/reject - Reject application
router.patch(
  '/:applicationId/reject',
  authenticate,
  staffAdminOnly,
  validate(rejectApplicationSchema),
  applicationsController.rejectApplication
);

// ============================================
// SHARED ROUTES (Startup/Staff Admin/Reviewer)
// ============================================

// GET /api/applications/:applicationId - Get single application
// Access control handled in service layer
router.get(
  '/:applicationId',
  authenticate,
  validate(getApplicationByIdSchema),
  applicationsController.getApplicationById
);

export default router;

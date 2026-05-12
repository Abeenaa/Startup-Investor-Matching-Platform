// Handles application management HTTP requests

import { Request, Response, NextFunction } from 'express';
import * as applicationsService from './applications.service';
import { successResponse } from '../../shared/utils/response';
import type {
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ListApplicationsQuery,
  ApproveApplicationRequest,
  RejectApplicationRequest,
} from './applications.types';

/**
 * POST /api/applications
 * Create a new application (draft) - Startup only
 */
export const createApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body as CreateApplicationRequest;
    const startupId = req.user!.startup!.id;

    const application = await applicationsService.createApplication(data, startupId);

    successResponse(res, application, 'Application created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/applications/:applicationId
 * Update draft application - Startup only
 */
export const updateApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const data = req.body as UpdateApplicationRequest;
    const startupId = req.user!.startup!.id;

    const application = await applicationsService.updateApplication(applicationId, data, startupId);

    successResponse(res, application, 'Application updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/applications/:applicationId/submit
 * Submit draft application - Startup only
 */
export const submitApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const startupId = req.user!.startup!.id;

    const application = await applicationsService.submitApplication(applicationId, startupId);

    successResponse(res, application, 'Application submitted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/my-applications
 * Get my applications - Startup only
 */
export const getMyApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as ListApplicationsQuery;
    const startupId = req.user!.startup!.id;

    const result = await applicationsService.getMyApplications(startupId, query);

    successResponse(res, result, 'Applications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:applicationId
 * Get single application - Startup/Staff Admin/Reviewer
 */
export const getApplicationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const application = await applicationsService.getApplicationById(applicationId, userId, userRole);

    successResponse(res, application, 'Application retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/applications/:applicationId
 * Delete draft application - Startup only
 */
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const startupId = req.user!.startup!.id;

    await applicationsService.deleteApplication(applicationId, startupId);

    successResponse(res, null, 'Application deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications
 * List all applications - Staff Admin only
 */
export const listAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as ListApplicationsQuery;

    const result = await applicationsService.listAllApplications(query);

    successResponse(res, result, 'Applications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/applications/:applicationId/approve
 * Approve application - Staff Admin only
 */
export const approveApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const { comments } = req.body as ApproveApplicationRequest;
    const decidedBy = req.user!.id;

    const application = await applicationsService.approveApplication(applicationId, decidedBy, comments);

    successResponse(res, application, 'Application approved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/applications/:applicationId/reject
 * Reject application - Staff Admin only
 */
export const rejectApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const { reason, comments } = req.body as RejectApplicationRequest;
    const decidedBy = req.user!.id;

    const application = await applicationsService.rejectApplication(applicationId, decidedBy, reason, comments);

    successResponse(res, application, 'Application rejected successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/applications/:applicationId/status
 * Update application status (Staff Admin)
 */
export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;
    const { status, rejectionReason } = req.body;
    const decidedBy = req.user!.id;

    const application = await applicationsService.updateApplicationStatus(
      applicationId,
      status,
      decidedBy,
      rejectionReason
    );

    successResponse(res, application, 'Application status updated successfully');
  } catch (error) {
    next(error);
  }
};

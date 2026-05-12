// Handles evaluation HTTP requests

import { Request, Response, NextFunction } from 'express';
import * as evaluationsService from './evaluations.service';
import { successResponse } from '../../shared/utils/response';
import type { CreateEvaluationRequest, UpdateEvaluationRequest } from './evaluations.types';

/**
 * POST /api/evaluations
 * Create evaluation (Reviewer only)
 */
export const createEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body as CreateEvaluationRequest;
    const reviewerId = req.user!.id;

    const evaluation = await evaluationsService.createEvaluation(data, reviewerId);

    successResponse(res, evaluation, 'Evaluation submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/evaluations/:evaluationId
 * Update evaluation (Reviewer only)
 */
export const updateEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { evaluationId } = req.params;
    const data = req.body as UpdateEvaluationRequest;
    const reviewerId = req.user!.id;

    const evaluation = await evaluationsService.updateEvaluation(evaluationId, data, reviewerId);

    successResponse(res, evaluation, 'Evaluation updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/evaluations/my-assignments
 * Get my assigned applications (Reviewer only)
 */
export const getMyAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviewerId = req.user!.id;
    const { status = 'pending', page = 1, limit = 10 } = req.query;

    const result = await evaluationsService.getMyAssignments(
      reviewerId,
      status as 'pending' | 'completed' | 'all',
      Number(page),
      Number(limit)
    );

    successResponse(res, result, 'Assignments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/evaluations/application/:applicationId
 * Get all evaluations for an application (Staff Admin only)
 */
export const getApplicationEvaluations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { applicationId } = req.params;

    const summary = await evaluationsService.getApplicationEvaluations(applicationId);

    successResponse(res, summary, 'Application evaluations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/evaluations/:evaluationId
 * Get single evaluation (Reviewer/Staff Admin)
 */
export const getEvaluationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { evaluationId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const evaluation = await evaluationsService.getEvaluationById(evaluationId, userId, userRole);

    successResponse(res, evaluation, 'Evaluation retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/evaluations/:evaluationId
 * Delete evaluation (Reviewer only)
 */
export const deleteEvaluation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { evaluationId } = req.params;
    const reviewerId = req.user!.id;

    await evaluationsService.deleteEvaluation(evaluationId, reviewerId);

    successResponse(res, null, 'Evaluation deleted successfully');
  } catch (error) {
    next(error);
  }
};

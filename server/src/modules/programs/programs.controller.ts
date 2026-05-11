// Handles program management HTTP requests

import { Request, Response, NextFunction } from 'express';
import * as programsService from './programs.service';
import { successResponse } from '../../shared/utils/response';
import type { CreateProgramRequest, UpdateProgramRequest, ListProgramsQuery } from './programs.types';

/**
 * POST /api/programs
 * Create a new program (Staff Admin only)
 */
export const createProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = req.body as CreateProgramRequest;
    const createdBy = req.user!.id;

    const program = await programsService.createProgram(data, createdBy);

    successResponse(res, program, 'Program created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/programs
 * List programs with filtering and pagination
 * Public endpoint - shows only active programs
 * Staff admin can see all programs with includeInactive=true
 */
export const listPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as ListProgramsQuery;
    const isAdmin = req.user?.role === 'STAFF_ADMIN';

    const result = await programsService.listPrograms(query, isAdmin);

    successResponse(res, result, 'Programs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/programs/:programId
 * Get single program details
 * Public endpoint
 */
export const getProgramById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { programId } = req.params;
    const isAdmin = req.user?.role === 'STAFF_ADMIN';

    const program = await programsService.getProgramById(programId, isAdmin);

    successResponse(res, program, 'Program retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/programs/:programId
 * Update program (Staff Admin only)
 */
export const updateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { programId } = req.params;
    const data = req.body as UpdateProgramRequest;

    const program = await programsService.updateProgram(programId, data);

    successResponse(res, program, 'Program updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/programs/:programId
 * Delete program (Staff Admin only)
 * Only programs with no applications can be deleted
 */
export const deleteProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { programId } = req.params;

    await programsService.deleteProgram(programId);

    successResponse(res, null, 'Program deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/programs/:programId/close
 * Close program early (Staff Admin only)
 */
export const closeProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { programId } = req.params;
    const { reason } = req.body;

    const program = await programsService.closeProgram(programId, reason);

    successResponse(res, program, 'Program closed successfully');
  } catch (error) {
    next(error);
  }
};

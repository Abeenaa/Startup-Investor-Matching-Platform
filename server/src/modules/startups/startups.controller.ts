// Startup Controller
// Handles HTTP requests for startup profile management

import { Request, Response, NextFunction } from 'express';
import * as startupService from './startups.service';
import { successResponse, paginatedResponse } from '../../shared/utils/response';
import { parsePaginationParams } from '../../shared/utils/pagination';

// ─── Profile Management ──────────────────────────────────────────────────────

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await startupService.createProfile(
      req.user!.id,
      req.user!.role,
      req.body
    );
    successResponse(res, profile, 'Startup profile created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await startupService.getMyProfile(req.user!.id);
    if (!profile) {
      successResponse(res, null, 'No startup profile found');
    } else {
      successResponse(res, profile, 'Startup profile retrieved successfully');
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await startupService.updateProfile(
      req.user!.id,
      req.user!.role,
      req.body
    );
    successResponse(res, profile, 'Startup profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─── Admin Operations ────────────────────────────────────────────────────────

export const getStartups = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page as string, req.query.limit as string);
    
    const filters = {
      sector: req.query.sector as string,
      stage: req.query.stage as string,
      approvalStatus: req.query.approvalStatus as any,
      search: req.query.search as string,
    };

    const { startups, total } = await startupService.getStartups(page, limit, filters);
    
    paginatedResponse(res, startups, page, limit, total, 'Startups retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getStartupById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startup = await startupService.getStartupById(req.params.startupId);
    successResponse(res, startup, 'Startup retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const approveStartup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startup = await startupService.approveStartup(req.params.startupId, {
      approvedBy: req.user!.id,
    });
    successResponse(res, startup, 'Startup approved successfully');
  } catch (error) {
    next(error);
  }
};

export const rejectStartup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startup = await startupService.rejectStartup(req.params.startupId, {
      rejectionReason: req.body.rejectionReason,
      rejectedBy: req.user!.id,
    });
    successResponse(res, startup, 'Startup rejected successfully');
  } catch (error) {
    next(error);
  }
};
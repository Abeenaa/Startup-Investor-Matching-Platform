// Investor Controller
// Handles HTTP requests for investor profile management

import { Request, Response, NextFunction } from 'express';
import * as investorService from './investors.service';
import { successResponse, paginatedResponse } from '../../shared/utils/response';
import { parsePaginationParams } from '../../shared/utils/pagination';

// ─── Profile Management ──────────────────────────────────────────────────────

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await investorService.createProfile(
      req.user!.id,
      req.user!.role,
      req.body
    );
    successResponse(res, profile, 'Investor profile created successfully', 201);
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
    const profile = await investorService.getMyProfile(req.user!.id);
    if (!profile) {
      successResponse(res, null, 'No investor profile found');
    } else {
      successResponse(res, profile, 'Investor profile retrieved successfully');
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
    const profile = await investorService.updateProfile(
      req.user!.id,
      req.user!.role,
      req.body
    );
    successResponse(res, profile, 'Investor profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─── Admin Operations ────────────────────────────────────────────────────────

export const getInvestors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page as string, req.query.limit as string);
    
    const filters = {
      sectorFocus: req.query.sectorFocus as string,
      investmentStage: req.query.investmentStage as string,
      approvalStatus: req.query.approvalStatus as any,
      search: req.query.search as string,
    };

    const { investors, total } = await investorService.getInvestors(page, limit, filters);
    
    paginatedResponse(res, investors, page, limit, total, 'Investors retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getInvestorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const investor = await investorService.getInvestorById(req.params.investorId);
    successResponse(res, investor, 'Investor retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const approveInvestor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const investor = await investorService.approveInvestor(req.params.investorId, {
      approvedBy: req.user!.id,
    });
    successResponse(res, investor, 'Investor approved successfully');
  } catch (error) {
    next(error);
  }
};
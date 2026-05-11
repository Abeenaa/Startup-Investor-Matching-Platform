// Handles public directory browsing and search requests

import { Request, Response, NextFunction } from 'express';
import * as directoryService from './directory.service';
import { successResponse } from '../../shared/utils/response';
import type { SearchStartupsQuery, SearchInvestorsQuery } from './directory.types';

/**
 * GET /api/directory/startups
 * Public endpoint - Search and browse approved startups
 */
export const searchStartups = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as SearchStartupsQuery;
    const result = await directoryService.searchStartups(query);

    successResponse(res, result, 'Startups retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/directory/startups/:startupId
 * Public endpoint - Get single approved startup details
 */
export const getStartupById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startupId } = req.params;
    const startup = await directoryService.getStartupById(startupId);

    successResponse(res, startup, 'Startup retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/directory/investors
 * Public endpoint - Search and browse approved investors
 */
export const searchInvestors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as unknown as SearchInvestorsQuery;
    const result = await directoryService.searchInvestors(query);

    successResponse(res, result, 'Investors retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/directory/investors/:investorId
 * Public endpoint - Get single approved investor details
 */
export const getInvestorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { investorId } = req.params;
    const investor = await directoryService.getInvestorById(investorId);

    successResponse(res, investor, 'Investor retrieved successfully');
  } catch (error) {
    next(error);
  }
};

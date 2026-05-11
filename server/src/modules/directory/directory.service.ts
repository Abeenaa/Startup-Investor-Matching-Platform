// Business logic for search, filtering, and pagination

import prisma from '../../database/prisma';
import { NotFoundError } from '../../shared/errors/AppError';
import { ApprovalStatus } from '@prisma/client';
import type {
  SearchStartupsQuery,
  SearchInvestorsQuery,
  PublicStartupProfile,
  PublicInvestorProfile,
  PaginatedResponse,
} from './directory.types';

/**
 * Search and filter approved startups in the public directory
 * Only returns APPROVED startups for public visibility
 */
export const searchStartups = async (
  query: SearchStartupsQuery
): Promise<PaginatedResponse<PublicStartupProfile>> => {
  const { search, sector, stage, page = 1, limit = 10 } = query;

  // Ensure page and limit are numbers
  const pageNum = Number(page);
  const limitNum = Number(limit);

  // Build dynamic filter conditions
  const where: any = {
    approvalStatus: ApprovalStatus.APPROVED, // Only show approved startups
  };

  // Add search filter (searches in name and description)
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Add sector filter
  if (sector) {
    where.sector = { equals: sector, mode: 'insensitive' };
  }

  // Add stage filter
  if (stage) {
    where.stage = { equals: stage, mode: 'insensitive' };
  }

  // Calculate pagination
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [startups, total] = await Promise.all([
    prisma.startup.findMany({
      where,
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        sector: true,
        stage: true,
        description: true,
        problemSolved: true,
        targetMarket: true,
        innovation: true,
        teamSize: true,
        website: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.startup.count({ where }),
  ]);

  return {
    data: startups,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get a single approved startup by ID for public viewing
 */
export const getStartupById = async (
  startupId: string
): Promise<PublicStartupProfile> => {
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    select: {
      id: true,
      name: true,
      sector: true,
      stage: true,
      description: true,
      problemSolved: true,
      targetMarket: true,
      innovation: true,
      teamSize: true,
      website: true,
      createdAt: true,
      approvalStatus: true, // Need this to check if approved
    },
  });

  if (!startup) {
    throw new NotFoundError('Startup not found');
  }

  // Only allow viewing approved startups publicly
  if (startup.approvalStatus !== ApprovalStatus.APPROVED) {
    throw new NotFoundError('Startup not found');
  }

  // Remove approval status from response (internal data)
  const { approvalStatus, ...publicProfile } = startup;

  return publicProfile;
};

/**
 * Search and filter approved investors in the public directory
 * Only returns APPROVED investors for public visibility
 */
export const searchInvestors = async (
  query: SearchInvestorsQuery
): Promise<PaginatedResponse<PublicInvestorProfile>> => {
  const { search, sector, investmentStage, page = 1, limit = 10 } = query;

  // Ensure page and limit are numbers
  const pageNum = Number(page);
  const limitNum = Number(limit);

  // Build dynamic filter conditions
  const where: any = {
    approvalStatus: ApprovalStatus.APPROVED, // Only show approved investors
  };

  // Add search filter (searches in name)
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  // Add sector filter (array contains)
  if (sector) {
    where.sectorFocus = { has: sector };
  }

  // Add investment stage filter (array contains)
  if (investmentStage) {
    where.investmentStage = { has: investmentStage };
  }

  // Calculate pagination
  const skip = (pageNum - 1) * limitNum;

  // Execute query with pagination
  const [investors, total] = await Promise.all([
    prisma.investor.findMany({
      where,
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        organizationType: true,
        investmentStage: true,
        sectorFocus: true,
        fundingCapacity: true,
        geographicFocus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.investor.count({ where }),
  ]);

  return {
    data: investors,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get a single approved investor by ID for public viewing
 */
export const getInvestorById = async (
  investorId: string
): Promise<PublicInvestorProfile> => {
  const investor = await prisma.investor.findUnique({
    where: { id: investorId },
    select: {
      id: true,
      name: true,
      organizationType: true,
      investmentStage: true,
      sectorFocus: true,
      fundingCapacity: true,
      geographicFocus: true,
      createdAt: true,
      approvalStatus: true, // Need this to check if approved
    },
  });

  if (!investor) {
    throw new NotFoundError('Investor not found');
  }

  // Only allow viewing approved investors publicly
  if (investor.approvalStatus !== ApprovalStatus.APPROVED) {
    throw new NotFoundError('Investor not found');
  }

  // Remove approval status from response (internal data)
  const { approvalStatus, ...publicProfile } = investor;

  return publicProfile;
};

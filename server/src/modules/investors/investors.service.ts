// Investor Service
// Business logic for investor profile management and approval workflow

import { ApprovalStatus, Role } from '@prisma/client';
import prisma from '../../database/prisma';
import { calculateSkip } from '../../shared/utils/pagination';
import { nullToUndef } from '../../shared/utils/nullToUndefined';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from '../../shared/errors/AppError';
import type {
  CreateInvestorProfileInput,
  UpdateInvestorProfileInput,
  InvestorProfile,
  InvestorListItem,
  InvestorFilters,
  ApproveInvestorInput,
} from './investors.types';

// Helper function to convert Prisma investor to InvestorProfile
const toInvestorProfile = (investor: any): InvestorProfile => ({
  id: investor.id,
  userId: investor.userId,
  name: investor.name,
  organizationType: nullToUndef(investor.organizationType),
  investmentStage: investor.investmentStage,
  sectorFocus: investor.sectorFocus,
  fundingCapacity: investor.fundingCapacity,
  geographicFocus: investor.geographicFocus,
  phoneNumber: investor.phoneNumber,
  registrationType: investor.registrationType,
  minimumInvestment: investor.minimumInvestment,
  isApproved: investor.isApproved,
  approvalStatus: investor.approvalStatus,
  approvedBy: nullToUndef(investor.approvedBy),
  approvedAt: nullToUndef(investor.approvedAt),
  rejectionReason: nullToUndef(investor.rejectionReason),
  createdAt: investor.createdAt,
  updatedAt: investor.updatedAt,
});

// Profile Management
/**
 * Create an investor profile (INVESTOR role only)
 * SRS 3.1.3 — investor profiles with investment preferences
 */
export const createProfile = async (
  userId: string,
  userRole: string,
  input: CreateInvestorProfileInput
): Promise<InvestorProfile> => {
  // Only INVESTOR role can create investor profiles
  if (userRole !== Role.INVESTOR) {
    throw new ForbiddenError('Only investor users can create investor profiles');
  }

  // Check if user already has an investor profile
  const existing = await prisma.investor.findUnique({ where: { userId } });
  if (existing) {
    throw new ConflictError('You already have an investor profile');
  }

  const investor = await prisma.investor.create({
    data: {
      userId,
      ...input,
      isApproved: false,
      approvalStatus: ApprovalStatus.PENDING,
    },
  });

  // Record profile creation in history (SRS 3.1.1 — traceability)
  await prisma.profileHistory.create({
    data: {
      userId,
      changeType: 'INVESTOR_PROFILE_CREATED',
      newValue: { 
        name: investor.name, 
        sectorFocus: investor.sectorFocus,
        fundingCapacity: investor.fundingCapacity,
      },
    },
  });

  return toInvestorProfile(investor);
};

//Get user's own investor profile
export const getMyProfile = async (userId: string): Promise<InvestorProfile | null> => {
  const investor = await prisma.investor.findUnique({
    where: { userId },
  });

  if (!investor) {
    return null;
  }

  return toInvestorProfile(investor);
};

/**
 * Update investor profile (owner only, unless approved)
 * SRS 3.1.3 — investors can update their profiles as investment focus evolves
 */
export const updateProfile = async (
  userId: string,
  userRole: string,
  input: UpdateInvestorProfileInput
): Promise<InvestorProfile> => {
  if (userRole !== Role.INVESTOR) {
    throw new ForbiddenError('Only investor users can update investor profiles');
  }

  const investor = await prisma.investor.findUnique({ where: { userId } });
  if (!investor) {
    throw new NotFoundError('Investor profile not found');
  }

  // Prevent updates to approved profiles (would need re-approval)
  if (investor.isApproved) {
    throw new BadRequestError('Cannot update approved profile. Contact admin for changes.');
  }

  const updated = await prisma.investor.update({
    where: { userId },
    data: {
      ...input,
      // Reset approval status if changes are made
      approvalStatus: ApprovalStatus.PENDING,
      isApproved: false,
      approvedBy: null,
      approvedAt: null,
    },
  });

  // Record profile update in history
  await prisma.profileHistory.create({
    data: {
      userId,
      changeType: 'INVESTOR_PROFILE_UPDATED',
      oldValue: {
        name: investor.name,
        sectorFocus: investor.sectorFocus,
        fundingCapacity: investor.fundingCapacity,
        approvalStatus: investor.approvalStatus,
      },
      newValue: {
        name: updated.name,
        sectorFocus: updated.sectorFocus,
        fundingCapacity: updated.fundingCapacity,
        approvalStatus: updated.approvalStatus,
      },
    },
  });

  return toInvestorProfile(updated);
};

// Admin Operations 
// Get paginated list of investors (admin/reviewer access)
export const getInvestors = async (
  page: number,
  limit: number,
  filters: InvestorFilters
): Promise<{ investors: InvestorListItem[]; total: number }> => {
  const skip = calculateSkip(page, limit);

  const where: any = {};

  if (filters.sectorFocus) {
    where.sectorFocus = {
      has: filters.sectorFocus,
    };
  }

  if (filters.investmentStage) {
    where.investmentStage = {
      has: filters.investmentStage,
    };
  }

  if (filters.approvalStatus) {
    where.approvalStatus = filters.approvalStatus;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { organizationType: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [investors, total] = await Promise.all([
    prisma.investor.findMany({
      where,
      select: {
        id: true,
        name: true,
        organizationType: true,
        sectorFocus: true,
        fundingCapacity: true,
        approvalStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.investor.count({ where }),
  ]);

  return { 
    investors: investors.map(investor => ({
      ...investor,
      organizationType: nullToUndef(investor.organizationType),
    })), 
    total 
  };
};

//Get single investor profile by ID (admin/reviewer access)
export const getInvestorById = async (investorId: string): Promise<InvestorProfile> => {
  const investor = await prisma.investor.findUnique({
    where: { id: investorId },
  });

  if (!investor) {
    throw new NotFoundError('Investor not found');
  }

  return toInvestorProfile(investor);
};

//Approve investor profile (admin only)
export const approveInvestor = async (
  investorId: string,
  input: ApproveInvestorInput
): Promise<InvestorProfile> => {
  const investor = await prisma.investor.findUnique({ where: { id: investorId } });
  if (!investor) {
    throw new NotFoundError('Investor not found');
  }

  if (investor.approvalStatus === ApprovalStatus.APPROVED) {
    throw new BadRequestError('Investor is already approved');
  }

  const updated = await prisma.investor.update({
    where: { id: investorId },
    data: {
      isApproved: true,
      approvalStatus: ApprovalStatus.APPROVED,
      approvedBy: input.approvedBy,
      approvedAt: new Date(),
      rejectionReason: null,
    },
  });

  // Record approval in history
  await prisma.profileHistory.create({
    data: {
      userId: investor.userId,
      changeType: 'INVESTOR_APPROVED',
      oldValue: { approvalStatus: investor.approvalStatus },
      newValue: { approvalStatus: ApprovalStatus.APPROVED },
      changedBy: input.approvedBy,
    },
  });

  return toInvestorProfile(updated);
};

// Reject investor profile (admin only)
export const rejectInvestor = async (
  investorId: string,
  input: RejectInvestorInput
): Promise<InvestorProfile> => {
  const investor = await prisma.investor.findUnique({ where: { id: investorId } });
  if (!investor) {
    throw new NotFoundError('Investor not found');
  }

  if (investor.approvalStatus === ApprovalStatus.REJECTED) {
    throw new BadRequestError('Investor is already rejected');
  }

  const updated = await prisma.investor.update({
    where: { id: investorId },
    data: {
      isApproved: false,
      approvalStatus: ApprovalStatus.REJECTED,
      rejectionReason: input.rejectionReason,
      approvedBy: null,
      approvedAt: null,
    },
  });

  // Record rejection in history
  await prisma.profileHistory.create({
    data: {
      userId: investor.userId,
      changeType: 'INVESTOR_REJECTED',
      oldValue: { approvalStatus: investor.approvalStatus },
      newValue: { 
        approvalStatus: ApprovalStatus.REJECTED,
        rejectionReason: input.rejectionReason,
      },
      changedBy: input.rejectedBy,
    },
  });

  return toInvestorProfile(updated);
};
// Startup Service
// Business logic for startup profile management and approval workflow

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
  CreateStartupProfileInput,
  UpdateStartupProfileInput,
  StartupProfile,
  StartupListItem,
  StartupFilters,
  ApproveStartupInput,
  RejectStartupInput,
} from './startups.types';

// Helper function to convert Prisma startup to StartupProfile
const toStartupProfile = (startup: any): StartupProfile => ({
  id: startup.id,
  userId: startup.userId,
  name: startup.name,
  sector: startup.sector,
  stage: startup.stage,
  description: startup.description,
  problemSolved: startup.problemSolved,
  targetMarket: startup.targetMarket,
  innovation: startup.innovation,
  teamSize: nullToUndef(startup.teamSize),
  fundingHistory: nullToUndef(startup.fundingHistory),
  tractionMetrics: startup.tractionMetrics as Record<string, any>,
  website: nullToUndef(startup.website),
  isApproved: startup.isApproved,
  approvalStatus: startup.approvalStatus,
  approvedBy: nullToUndef(startup.approvedBy),
  approvedAt: nullToUndef(startup.approvedAt),
  rejectionReason: nullToUndef(startup.rejectionReason),
  createdAt: startup.createdAt,
  updatedAt: startup.updatedAt,
});

// ─── Profile Management ──────────────────────────────────────────────────────

/**
 * Create a startup profile (STARTUP role only)
 * SRS 3.1.2 — comprehensive digital profiles
 */
export const createProfile = async (
  userId: string,
  userRole: string,
  input: CreateStartupProfileInput
): Promise<StartupProfile> => {
  // Only STARTUP role can create startup profiles
  if (userRole !== Role.STARTUP) {
    throw new ForbiddenError('Only startup users can create startup profiles');
  }

  // Check if user already has a startup profile
  const existing = await prisma.startup.findUnique({ where: { userId } });
  if (existing) {
    throw new ConflictError('You already have a startup profile');
  }

  // Check for duplicate startup name
  const nameExists = await prisma.startup.findFirst({
    where: { name: input.name },
  });
  if (nameExists) {
    throw new ConflictError('A startup with this name already exists');
  }

  const startup = await prisma.startup.create({
    data: {
      userId,
      ...input,
      isApproved: false,
      approvalStatus: ApprovalStatus.PENDING,
    },
    include: {
      user: { select: { email: true } },
    },
  });

  // Record profile creation in history (SRS 3.1.1 — traceability)
  await prisma.profileHistory.create({
    data: {
      userId,
      changeType: 'STARTUP_PROFILE_CREATED',
      newValue: { name: startup.name, sector: startup.sector, stage: startup.stage },
    },
  });

  return toStartupProfile(startup);
};

/**
 * Get user's own startup profile
 */
export const getMyProfile = async (userId: string): Promise<StartupProfile | null> => {
  const startup = await prisma.startup.findUnique({
    where: { userId },
  });

  if (!startup) {
    return null;
  }

  return toStartupProfile(startup);
};

/**
 * Update startup profile (owner only, unless approved)
 * SRS 3.1.2 — users can update profile content
 */
export const updateProfile = async (
  userId: string,
  userRole: string,
  input: UpdateStartupProfileInput
): Promise<StartupProfile> => {
  if (userRole !== Role.STARTUP) {
    throw new ForbiddenError('Only startup users can update startup profiles');
  }

  const startup = await prisma.startup.findUnique({ where: { userId } });
  if (!startup) {
    throw new NotFoundError('Startup profile not found');
  }

  // Prevent updates to approved profiles (would need re-approval)
  if (startup.isApproved) {
    throw new BadRequestError('Cannot update approved profile. Contact admin for changes.');
  }

  // Check for name conflicts if name is being changed
  if (input.name && input.name !== startup.name) {
    const nameExists = await prisma.startup.findFirst({
      where: { name: input.name, id: { not: startup.id } },
    });
    if (nameExists) {
      throw new ConflictError('A startup with this name already exists');
    }
  }

  const updated = await prisma.startup.update({
    where: { userId },
    data: {
      ...input,
      // Reset approval status if significant changes are made
      approvalStatus: ApprovalStatus.PENDING,
      isApproved: false,
      approvedBy: null,
      approvedAt: null,
      rejectionReason: null,
    },
  });

  // Record profile update in history
  await prisma.profileHistory.create({
    data: {
      userId,
      changeType: 'STARTUP_PROFILE_UPDATED',
      oldValue: {
        name: startup.name,
        sector: startup.sector,
        stage: startup.stage,
        approvalStatus: startup.approvalStatus,
      },
      newValue: {
        name: updated.name,
        sector: updated.sector,
        stage: updated.stage,
        approvalStatus: updated.approvalStatus,
      },
    },
  });

  return toStartupProfile(updated);
};

// ─── Admin Operations ────────────────────────────────────────────────────────

/**
 * Get paginated list of startups (admin/reviewer access)
 * SRS 3.1.4 — admin authority to review and approve profiles
 */
export const getStartups = async (
  page: number,
  limit: number,
  filters: StartupFilters
): Promise<{ startups: StartupListItem[]; total: number }> => {
  const skip = calculateSkip(page, limit);

  const where: any = {};

  if (filters.sector) {
    where.sector = filters.sector;
  }

  if (filters.stage) {
    where.stage = filters.stage;
  }

  if (filters.approvalStatus) {
    where.approvalStatus = filters.approvalStatus;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [startups, total] = await Promise.all([
    prisma.startup.findMany({
      where,
      select: {
        id: true,
        name: true,
        sector: true,
        stage: true,
        description: true,
        website: true,
        approvalStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.startup.count({ where }),
  ]);

  return { 
    startups: startups.map(startup => ({
      ...startup,
      website: nullToUndef(startup.website),
    })), 
    total 
  };
};

/**
 * Get single startup profile by ID (admin/reviewer access)
 */
export const getStartupById = async (startupId: string): Promise<StartupProfile> => {
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
  });

  if (!startup) {
    throw new NotFoundError('Startup not found');
  }

  return toStartupProfile(startup);
};

/**
 * Approve startup profile (admin only)
 * SRS 3.1.4 — only approved profiles appear in public directory
 */
export const approveStartup = async (
  startupId: string,
  input: ApproveStartupInput
): Promise<StartupProfile> => {
  const startup = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!startup) {
    throw new NotFoundError('Startup not found');
  }

  if (startup.approvalStatus === ApprovalStatus.APPROVED) {
    throw new BadRequestError('Startup is already approved');
  }

  const updated = await prisma.startup.update({
    where: { id: startupId },
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
      userId: startup.userId,
      changeType: 'STARTUP_APPROVED',
      oldValue: { approvalStatus: startup.approvalStatus },
      newValue: { approvalStatus: ApprovalStatus.APPROVED },
      changedBy: input.approvedBy,
    },
  });

  return toStartupProfile(updated);
};

/**
 * Reject startup profile (admin only)
 */
export const rejectStartup = async (
  startupId: string,
  input: RejectStartupInput
): Promise<StartupProfile> => {
  const startup = await prisma.startup.findUnique({ where: { id: startupId } });
  if (!startup) {
    throw new NotFoundError('Startup not found');
  }

  if (startup.approvalStatus === ApprovalStatus.REJECTED) {
    throw new BadRequestError('Startup is already rejected');
  }

  const updated = await prisma.startup.update({
    where: { id: startupId },
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
      userId: startup.userId,
      changeType: 'STARTUP_REJECTED',
      oldValue: { approvalStatus: startup.approvalStatus },
      newValue: { 
        approvalStatus: ApprovalStatus.REJECTED,
        rejectionReason: input.rejectionReason,
      },
      changedBy: input.rejectedBy,
    },
  });

  return toStartupProfile(updated);
};
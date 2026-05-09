// Admin Service
// Business logic for staff admin to manage system admins and reviewers

import { Role } from '@prisma/client';
import prisma from '../../database/prisma';
import { hashPassword } from '../../shared/utils/passwords';
import { calculateSkip } from '../../shared/utils/pagination';
import { canManageRole } from '../../shared/constants/roles';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from '../../shared/errors/AppError';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserListItem,
  UserManagementFilters,
  AssignReviewerInput,
  ReviewerAssignment,
} from './admin.types';

// User Management 
//Create a new system admin or reviewer (staff admin only)
export const createUser = async (
  creatorRole: string,
  creatorId: string,
  input: CreateUserInput
): Promise<UserListItem> => {
  const { email, password, role } = input;

  // Only staff admin can create system admins and reviewers
  if (!canManageRole(creatorRole, role)) {
    throw new ForbiddenError('You do not have permission to create users with this role');
  }

  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Record user creation in profile history
  await prisma.profileHistory.create({
    data: {
      userId: user.id,
      changeType: 'USER_CREATED',
      newValue: { email: user.email, role: user.role },
      changedBy: creatorId,
    },
  });

  return user;
};

//Get paginated list of users with filtering
export const getUsers = async (
  page: number,
  limit: number,
  filters: UserManagementFilters
): Promise<{ users: UserListItem[]; total: number }> => {
  const skip = calculateSkip(page, limit);

  const where: any = {};

  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.search) {
    where.email = {
      contains: filters.search,
      mode: 'insensitive',
    };
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

// Update user details (staff admin only for system admins/reviewers)
export const updateUser = async (
  updaterRole: string,
  updaterId: string,
  userId: string,
  input: UpdateUserInput
): Promise<UserListItem> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if updater can manage this user's role
  if (!canManageRole(updaterRole, user.role)) {
    throw new ForbiddenError('You do not have permission to update this user');
  }

  // If changing role, check if updater can assign the new role
  if (input.role && !canManageRole(updaterRole, input.role)) {
    throw new ForbiddenError('You do not have permission to assign this role');
  }

  // Check for email conflicts if email is being changed
  if (input.email && input.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Record the change in profile history
  await prisma.profileHistory.create({
    data: {
      userId,
      changeType: 'USER_UPDATED',
      oldValue: { email: user.email, role: user.role, isActive: user.isActive },
      newValue: { email: updatedUser.email, role: updatedUser.role, isActive: updatedUser.isActive },
      changedBy: updaterId,
    },
  });

  return updatedUser;
};

//Delete/deactivate user (staff admin only)
export const deleteUser = async (
  deleterRole: string,
  deleterId: string,
  userId: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isActive: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Check if deleter can manage this user's role
  if (!canManageRole(deleterRole, user.role)) {
    throw new ForbiddenError('You do not have permission to delete this user');
  }

  // Prevent deleting yourself
  if (userId === deleterId) {
    throw new BadRequestError('You cannot delete your own account');
  }

  // Soft delete by deactivating the account
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  // Record the deletion in profile history
  await prisma.profileHistory.create({
    data: {
      userId,
      changeType: 'USER_DELETED',
      oldValue: { isActive: true },
      newValue: { isActive: false },
      changedBy: deleterId,
    },
  });
};

// Reviewer Assignment 
//Assign reviewers to applications (staff admin only)
export const assignReviewers = async (
  assignerId: string,
  input: AssignReviewerInput
): Promise<ReviewerAssignment[]> => {
  const { reviewerIds, applicationIds } = input;

  // Verify all reviewers exist and are active
  const reviewers = await prisma.user.findMany({
    where: {
      id: { in: reviewerIds },
      role: Role.REVIEWER,
      isActive: true,
    },
    select: { id: true, email: true },
  });

  if (reviewers.length !== reviewerIds.length) {
    throw new BadRequestError('One or more reviewers not found or inactive');
  }

  // Verify all applications exist
  const applications = await prisma.application.findMany({
    where: { id: { in: applicationIds } },
    select: { id: true, startup: { select: { name: true } } },
  });

  if (applications.length !== applicationIds.length) {
    throw new BadRequestError('One or more applications not found');
  }

  // Create evaluation records for each reviewer-application pair
  const assignments: ReviewerAssignment[] = [];

  for (const reviewer of reviewers) {
    for (const application of applications) {
      // Check if this reviewer is already assigned to this application
      const existing = await prisma.evaluation.findUnique({
        where: {
          applicationId_reviewerId: {
            applicationId: application.id,
            reviewerId: reviewer.id,
          },
        },
      });

      if (!existing) {
        await prisma.evaluation.create({
          data: {
            applicationId: application.id,
            reviewerId: reviewer.id,
            score: 0, // Default score, will be updated when reviewer submits
            comments: '', // Empty initially
            recommendation: 'NEEDS_IMPROVEMENT', // Default recommendation
          },
        });

        assignments.push({
          reviewerId: reviewer.id,
          reviewerEmail: reviewer.email,
          applicationId: application.id,
          applicationTitle: application.startup.name,
          assignedAt: new Date(),
        });
      }
    }
  }

  return assignments;
};

//Get all reviewer assignments
export const getReviewerAssignments = async (): Promise<ReviewerAssignment[]> => {
  const evaluations = await prisma.evaluation.findMany({
    include: {
      reviewer: { select: { id: true, email: true } },
      application: {
        select: {
          id: true,
          startup: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return evaluations.map((evaluation) => ({
    reviewerId: evaluation.reviewer.id,
    reviewerEmail: evaluation.reviewer.email,
    applicationId: evaluation.application.id,
    applicationTitle: evaluation.application.startup.name,
    assignedAt: evaluation.createdAt,
  }));
};
// Business logic for programs management

import prisma from '../../database/prisma';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../shared/errors/AppError';
import { ProgramType } from '@prisma/client';
import type {
  CreateProgramRequest,
  UpdateProgramRequest,
  ListProgramsQuery,
  PublicProgramResponse,
  AdminProgramResponse,
  PaginatedProgramsResponse,
} from './programs.types';

/**
 * Create a new program (Staff Admin only)
 */
export const createProgram = async (
  data: CreateProgramRequest,
  createdBy: string
): Promise<AdminProgramResponse> => {
  const program = await prisma.program.create({
    data: {
      ...data,
      benefits: data.benefits || [],
      createdBy,
    },
  });

  return formatAdminProgramResponse(program);
};

/**
 * List programs with filtering and pagination
 * Public users see only active programs with deadline not passed
 * Staff admin can see all programs
 */
export const listPrograms = async (
  query: ListProgramsQuery,
  isAdmin: boolean = false
): Promise<PaginatedProgramsResponse> => {
  const { type, isActive, includeInactive, page = 1, limit = 10 } = query;

  // Ensure page and limit are numbers
  const pageNum = Number(page);
  const limitNum = Number(limit);

  // Build filter conditions
  const where: any = {};

  // Filter by type
  if (type) {
    where.type = type;
  }

  // Filter by active status
  if (isAdmin && includeInactive) {
    // Admin can see all programs
  } else if (isActive !== undefined) {
    where.isActive = isActive;
  } else {
    // Public users only see active programs with deadline not passed
    where.isActive = true;
    where.deadline = { gte: new Date() };
  }

  // Calculate pagination
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const [programs, total] = await Promise.all([
    prisma.program.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.program.count({ where }),
  ]);

  return {
    data: programs.map(formatPublicProgramResponse),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get a single program by ID
 */
export const getProgramById = async (
  programId: string,
  isAdmin: boolean = false
): Promise<PublicProgramResponse | AdminProgramResponse> => {
  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    throw new NotFoundError('Program not found');
  }

  // Public users can only see active programs with deadline not passed
  if (!isAdmin && (!program.isActive || program.deadline < new Date())) {
    throw new NotFoundError('Program not found');
  }

  return isAdmin ? formatAdminProgramResponse(program) : formatPublicProgramResponse(program);
};

/**
 * Update a program (Staff Admin only)
 */
export const updateProgram = async (
  programId: string,
  data: UpdateProgramRequest
): Promise<AdminProgramResponse> => {
  // Check if program exists
  const existingProgram = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!existingProgram) {
    throw new NotFoundError('Program not found');
  }

  // Validate business rules
  if (data.startDate && data.deadline) {
    if (data.startDate >= data.deadline) {
      throw new BadRequestError('Start date must be before deadline');
    }
  }

  // Update program
  const program = await prisma.program.update({
    where: { id: programId },
    data,
  });

  return formatAdminProgramResponse(program);
};

/**
 * Delete a program (Staff Admin only)
 * Only programs with no applications can be deleted
 */
export const deleteProgram = async (programId: string): Promise<void> => {
  // Check if program exists
  const program = await prisma.program.findUnique({
    where: { id: programId },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!program) {
    throw new NotFoundError('Program not found');
  }

  // Cannot delete program with applications
  if (program._count.applications > 0) {
    throw new BadRequestError(
      `Cannot delete program with ${program._count.applications} application(s). Close the program instead.`
    );
  }

  await prisma.program.delete({
    where: { id: programId },
  });
};

/**
 * Close a program early (Staff Admin only)
 * Sets isActive to false, preventing new applications
 */
export const closeProgram = async (
  programId: string,
  reason?: string
): Promise<AdminProgramResponse> => {
  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    throw new NotFoundError('Program not found');
  }

  if (!program.isActive) {
    throw new BadRequestError('Program is already closed');
  }

  const updatedProgram = await prisma.program.update({
    where: { id: programId },
    data: { isActive: false },
  });

  // TODO: Optionally log the closure reason in an audit table

  return formatAdminProgramResponse(updatedProgram);
};

/**
 * Check if a program can accept new applications
 */
export const canAcceptApplications = async (programId: string): Promise<boolean> => {
  const program = await prisma.program.findUnique({
    where: { id: programId },
  });

  if (!program) {
    return false;
  }

  // Check if program is active
  if (!program.isActive) {
    return false;
  }

  // Check if deadline has passed
  if (program.deadline < new Date()) {
    return false;
  }

  // Check if max applicants reached
  if (program.maxApplicants && program.applicationCount >= program.maxApplicants) {
    return false;
  }

  return true;
};

// Helper functions to format responses

function formatPublicProgramResponse(program: any): PublicProgramResponse {
  const now = new Date();
  const isOpen =
    program.isActive &&
    program.deadline > now &&
    (!program.maxApplicants || program.applicationCount < program.maxApplicants);

  const spotsRemaining = program.maxApplicants
    ? program.maxApplicants - program.applicationCount
    : undefined;

  return {
    id: program.id,
    name: program.name,
    type: program.type,
    description: program.description,
    eligibilityCriteria: program.eligibilityCriteria,
    fundingAmount: program.fundingAmount,
    benefits: program.benefits,
    deadline: program.deadline,
    startDate: program.startDate,
    duration: program.duration,
    maxApplicants: program.maxApplicants,
    applicationCount: program.applicationCount,
    evaluationStages: program.evaluationStages,
    expectedOutcomes: program.expectedOutcomes,
    isActive: program.isActive,
    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
    isOpen,
    spotsRemaining,
  };
}

function formatAdminProgramResponse(program: any): AdminProgramResponse {
  return {
    ...formatPublicProgramResponse(program),
    createdBy: program.createdBy,
  };
}

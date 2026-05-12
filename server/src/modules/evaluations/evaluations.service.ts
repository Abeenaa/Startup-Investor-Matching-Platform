// Business logic for evaluations management

import prisma from '../../database/prisma';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../shared/errors/AppError';
import { ApplicationStatus } from '@prisma/client';
import type {
  CreateEvaluationRequest,
  UpdateEvaluationRequest,
  EvaluationResponse,
  AssignedApplicationResponse,
  ApplicationEvaluationsSummary,
  PaginatedEvaluationsResponse,
  EvaluationRecommendation,
} from './evaluations.types';

/**
 * Create evaluation (Reviewer only)
 * Reviewer must be assigned to the application
 */
export const createEvaluation = async (
  data: CreateEvaluationRequest,
  reviewerId: string
): Promise<EvaluationResponse> => {
  // Check if application exists and is under review
  const application = await prisma.application.findUnique({
    where: { id: data.applicationId },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  if (application.status !== ApplicationStatus.UNDER_REVIEW) {
    throw new BadRequestError('Application must be under review to be evaluated');
  }

  // Check if reviewer is assigned to this application
  // This would require a reviewer assignment table (not in current schema)
  // For now, we'll allow any reviewer to evaluate any UNDER_REVIEW application
  // TODO: Implement reviewer assignment check

  // Check if reviewer already evaluated this application
  const existingEvaluation = await prisma.evaluation.findUnique({
    where: {
      applicationId_reviewerId: {
        applicationId: data.applicationId,
        reviewerId,
      },
    },
  });

  if (existingEvaluation) {
    throw new BadRequestError('You have already evaluated this application');
  }

  // Create evaluation
  const evaluation = await prisma.evaluation.create({
    data: {
      applicationId: data.applicationId,
      reviewerId,
      score: data.score,
      comments: data.comments,
      recommendation: data.recommendation,
      hasConflict: data.hasConflict,
      conflictReason: data.conflictReason,
    },
    include: {
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return formatEvaluationResponse(evaluation);
};

/**
 * Update evaluation (Reviewer only)
 * Can only update own evaluations before application is decided
 */
export const updateEvaluation = async (
  evaluationId: string,
  data: UpdateEvaluationRequest,
  reviewerId: string
): Promise<EvaluationResponse> => {
  // Get evaluation
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: {
      application: true,
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!evaluation) {
    throw new NotFoundError('Evaluation not found');
  }

  // Check ownership
  if (evaluation.reviewerId !== reviewerId) {
    throw new ForbiddenError('You can only update your own evaluations');
  }

  // Cannot update if application already decided
  if (
    evaluation.application.status === ApplicationStatus.APPROVED ||
    evaluation.application.status === ApplicationStatus.REJECTED
  ) {
    throw new BadRequestError('Cannot update evaluation after application has been decided');
  }

  // Update evaluation
  const updatedEvaluation = await prisma.evaluation.update({
    where: { id: evaluationId },
    data,
    include: {
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return formatEvaluationResponse(updatedEvaluation);
};

/**
 * Get my assigned applications (Reviewer)
 * Shows applications under review
 */
export const getMyAssignments = async (
  reviewerId: string,
  status: 'pending' | 'completed' | 'all',
  page: number = 1,
  limit: number = 10
): Promise<PaginatedEvaluationsResponse> => {
  const pageNum = Number(page);
  const limitNum = Number(limit);

  // Build filter
  const where: any = {
    status: ApplicationStatus.UNDER_REVIEW,
  };

  // Calculate pagination
  const skip = (pageNum - 1) * limitNum;

  // Get applications
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        program: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        startup: {
          select: {
            id: true,
            name: true,
            sector: true,
            stage: true,
          },
        },
        evaluations: {
          where: { reviewerId },
          include: {
            reviewer: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { submittedAt: 'asc' }, // Oldest first (FIFO)
    }),
    prisma.application.count({ where }),
  ]);

  // Filter based on status
  let filteredApplications = applications;
  if (status === 'pending') {
    filteredApplications = applications.filter((app) => app.evaluations.length === 0);
  } else if (status === 'completed') {
    filteredApplications = applications.filter((app) => app.evaluations.length > 0);
  }

  return {
    data: filteredApplications.map((app) => formatAssignedApplicationResponse(app)),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredApplications.length,
      totalPages: Math.ceil(filteredApplications.length / limitNum),
    },
  };
};

/**
 * Get all evaluations for an application (Staff Admin)
 */
export const getApplicationEvaluations = async (
  applicationId: string
): Promise<ApplicationEvaluationsSummary> => {
  // Check if application exists
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      evaluations: {
        include: {
          reviewer: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Calculate statistics
  const evaluations = application.evaluations;
  const totalEvaluations = evaluations.length;
  const averageScore =
    totalEvaluations > 0
      ? evaluations.reduce((sum, e) => sum + e.score, 0) / totalEvaluations
      : 0;

  const recommendations = {
    approve: evaluations.filter((e) => e.recommendation === 'APPROVE').length,
    reject: evaluations.filter((e) => e.recommendation === 'REJECT').length,
    needsImprovement: evaluations.filter((e) => e.recommendation === 'NEEDS_IMPROVEMENT').length,
  };

  return {
    applicationId,
    totalEvaluations,
    averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
    recommendations,
    evaluations: evaluations.map(formatEvaluationResponse),
  };
};

/**
 * Get single evaluation by ID
 */
export const getEvaluationById = async (
  evaluationId: string,
  userId: string,
  userRole: string
): Promise<EvaluationResponse> => {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: {
      reviewer: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!evaluation) {
    throw new NotFoundError('Evaluation not found');
  }

  // Check access: reviewer (owner) or staff admin
  const isOwner = evaluation.reviewerId === userId;
  const isAdmin = userRole === 'STAFF_ADMIN';

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError('You do not have permission to view this evaluation');
  }

  return formatEvaluationResponse(evaluation);
};

/**
 * Delete evaluation (Reviewer only, before decision)
 */
export const deleteEvaluation = async (
  evaluationId: string,
  reviewerId: string
): Promise<void> => {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: {
      application: true,
    },
  });

  if (!evaluation) {
    throw new NotFoundError('Evaluation not found');
  }

  // Check ownership
  if (evaluation.reviewerId !== reviewerId) {
    throw new ForbiddenError('You can only delete your own evaluations');
  }

  // Cannot delete if application already decided
  if (
    evaluation.application.status === ApplicationStatus.APPROVED ||
    evaluation.application.status === ApplicationStatus.REJECTED
  ) {
    throw new BadRequestError('Cannot delete evaluation after application has been decided');
  }

  await prisma.evaluation.delete({
    where: { id: evaluationId },
  });
};

// Helper functions

function formatEvaluationResponse(evaluation: any): EvaluationResponse {
  return {
    id: evaluation.id,
    applicationId: evaluation.applicationId,
    reviewerId: evaluation.reviewerId,
    reviewer: evaluation.reviewer,
    score: evaluation.score,
    comments: evaluation.comments,
    recommendation: evaluation.recommendation as EvaluationRecommendation,
    hasConflict: evaluation.hasConflict,
    conflictReason: evaluation.conflictReason,
    createdAt: evaluation.createdAt,
    updatedAt: evaluation.updatedAt,
  };
}

function formatAssignedApplicationResponse(application: any): AssignedApplicationResponse {
  return {
    id: application.id,
    program: application.program,
    startup: application.startup,
    status: application.status,
    submittedAt: application.submittedAt,
    additionalInfo: application.additionalInfo,
    pitchDeck: application.pitchDeck,
    businessPlan: application.businessPlan,
    financials: application.financials,
    otherDocuments: application.otherDocuments,
    myEvaluation: application.evaluations[0]
      ? formatEvaluationResponse(application.evaluations[0])
      : undefined,
  };
}

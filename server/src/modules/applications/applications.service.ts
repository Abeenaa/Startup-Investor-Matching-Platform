// Business logic for applications management

import prisma from '../../database/prisma';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../shared/errors/AppError';
import { ApplicationStatus, ApprovalStatus } from '@prisma/client';
import * as programsService from '../programs/programs.service';
import { emailService } from '../../shared/services/email.service';
import type {
  CreateApplicationRequest,
  UpdateApplicationRequest,
  ListApplicationsQuery,
  ApplicationResponse,
  AdminApplicationResponse,
  PaginatedApplicationsResponse,
} from './applications.types';

/**
 * Create a new application (draft)
 * Startup must have approved profile
 */
export const createApplication = async (
  data: CreateApplicationRequest,
  startupId: string
): Promise<ApplicationResponse> => {
  // Check if startup profile is approved
  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
  });

  if (!startup) {
    throw new NotFoundError('Startup profile not found');
  }

  if (startup.approvalStatus !== ApprovalStatus.APPROVED) {
    throw new ForbiddenError('Your startup profile must be approved before applying to programs');
  }

  // Check if program exists and can accept applications
  const canApply = await programsService.canAcceptApplications(data.programId);
  if (!canApply) {
    throw new BadRequestError('This program is not accepting applications');
  }

  // Check if startup already has an application for this program
  const existingApplication = await prisma.application.findUnique({
    where: {
      startupId_programId: {
        startupId,
        programId: data.programId,
      },
    },
  });

  if (existingApplication) {
    throw new BadRequestError('You have already applied to this program');
  }

  // Create draft application
  const application = await prisma.application.create({
    data: {
      startupId,
      programId: data.programId,
      status: ApplicationStatus.DRAFT,
      additionalInfo: data.additionalInfo,
      pitchDeck: data.pitchDeck,
      businessPlan: data.businessPlan,
      financials: data.financials,
      otherDocuments: data.otherDocuments as any, // JSON field
    },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
        },
      },
    },
  });

  return formatApplicationResponse(application);
};

/**
 * Update draft application
 * Only DRAFT applications can be updated
 */
export const updateApplication = async (
  applicationId: string,
  data: UpdateApplicationRequest,
  startupId: string
): Promise<ApplicationResponse> => {
  // Get application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      program: true,
    },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Check ownership
  if (application.startupId !== startupId) {
    throw new ForbiddenError('You can only update your own applications');
  }

  // Can only update DRAFT applications
  if (application.status !== ApplicationStatus.DRAFT) {
    throw new BadRequestError('Only draft applications can be updated');
  }

  // Update application
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      additionalInfo: data.additionalInfo,
      pitchDeck: data.pitchDeck,
      businessPlan: data.businessPlan,
      financials: data.financials,
      otherDocuments: data.otherDocuments as any, // JSON field
    },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
        },
      },
    },
  });

  return formatApplicationResponse(updatedApplication);
};

/**
 * Submit draft application
 * Changes status from DRAFT to SUBMITTED
 */
export const submitApplication = async (
  applicationId: string,
  startupId: string
): Promise<ApplicationResponse> => {
  // Get application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      program: true,
    },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Check ownership
  if (application.startupId !== startupId) {
    throw new ForbiddenError('You can only submit your own applications');
  }

  // Can only submit DRAFT applications
  if (application.status !== ApplicationStatus.DRAFT) {
    throw new BadRequestError('Only draft applications can be submitted');
  }

  // Check if program can still accept applications
  const canApply = await programsService.canAcceptApplications(application.programId);
  if (!canApply) {
    throw new BadRequestError('This program is no longer accepting applications');
  }

  // Submit application and increment program application count
  const [submittedApplication] = await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: {
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      },
      include: {
        program: {
          select: {
            id: true,
            name: true,
            type: true,
            deadline: true,
          },
        },
        startup: {
          select: {
            name: true,
            user: { select: { email: true } },
          },
        },
      },
    }),
    prisma.program.update({
      where: { id: application.programId },
      data: {
        applicationCount: {
          increment: 1,
        },
      },
    }),
  ]);

  // Send submission confirmation email (non-blocking)
  emailService.sendApplicationSubmitted(
    submittedApplication.startup.user.email,
    submittedApplication.startup.name,
    submittedApplication.program.name
  ).catch(err => console.error('Failed to send submission email:', err));

  return formatApplicationResponse(submittedApplication);
};

/**
 * Get my applications (for startup user)
 */
export const getMyApplications = async (
  startupId: string,
  query: ListApplicationsQuery
): Promise<PaginatedApplicationsResponse> => {
  const { programId, status, page = 1, limit = 10 } = query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  // Build filter
  const where: any = { startupId };

  if (programId) {
    where.programId = programId;
  }

  if (status) {
    where.status = status;
  }

  // Calculate pagination
  const skip = (pageNum - 1) * limitNum;

  // Execute query
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
            deadline: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    data: applications.map(formatApplicationResponse),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get single application by ID
 */
export const getApplicationById = async (
  applicationId: string,
  userId: string,
  userRole: string
): Promise<ApplicationResponse | AdminApplicationResponse> => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
        },
      },
      startup: {
        select: {
          id: true,
          name: true,
          sector: true,
          stage: true,
          userId: true,
        },
      },
    },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Check access: startup owner, staff admin, or assigned reviewer
  const isOwner = application.startup.userId === userId;
  const isAdmin = userRole === 'STAFF_ADMIN';
  const isReviewer = userRole === 'REVIEWER';

  if (!isOwner && !isAdmin && !isReviewer) {
    throw new ForbiddenError('You do not have permission to view this application');
  }

  // Reviewers can only see UNDER_REVIEW applications assigned to them
  if (isReviewer) {
    const evaluation = await prisma.evaluation.findFirst({
      where: {
        applicationId,
        reviewerId: userId,
      },
    });

    if (!evaluation) {
      throw new ForbiddenError('You are not assigned to review this application');
    }
  }

  return isAdmin ? formatAdminApplicationResponse(application) : formatApplicationResponse(application);
};

/**
 * Delete draft application
 * Only DRAFT applications can be deleted
 */
export const deleteApplication = async (
  applicationId: string,
  startupId: string
): Promise<void> => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Check ownership
  if (application.startupId !== startupId) {
    throw new ForbiddenError('You can only delete your own applications');
  }

  // Can only delete DRAFT applications
  if (application.status !== ApplicationStatus.DRAFT) {
    throw new BadRequestError('Only draft applications can be deleted');
  }

  await prisma.application.delete({
    where: { id: applicationId },
  });
};

// Helper functions

function formatApplicationResponse(application: any): ApplicationResponse {
  return {
    id: application.id,
    programId: application.programId,
    program: application.program,
    status: application.status,
    additionalInfo: application.additionalInfo,
    pitchDeck: application.pitchDeck,
    businessPlan: application.businessPlan,
    financials: application.financials,
    otherDocuments: application.otherDocuments,
    submittedAt: application.submittedAt,
    rejectionReason: application.rejectionReason,
    decidedAt: application.decidedAt,
    reapplicationCount: application.reapplicationCount,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
  };
}

function formatAdminApplicationResponse(application: any): AdminApplicationResponse {
  return {
    ...formatApplicationResponse(application),
    startup: application.startup,
    decidedBy: application.decidedBy,
    previousApplicationId: application.previousApplicationId,
  };
}

/**
 * List all applications (Staff Admin)
 * Can filter by program and status
 */
export const listAllApplications = async (
  query: ListApplicationsQuery
): Promise<PaginatedApplicationsResponse> => {
  const { programId, status, page = 1, limit = 10 } = query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  // Build filter
  const where: any = {};

  if (programId) {
    where.programId = programId;
  }

  if (status) {
    where.status = status;
  }

  // Calculate pagination
  const skip = (pageNum - 1) * limitNum;

  // Execute query
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
            deadline: true,
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
      },
      orderBy: { submittedAt: 'desc' },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    data: applications.map(formatAdminApplicationResponse),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Approve application (Staff Admin)
 */
export const approveApplication = async (
  applicationId: string,
  decidedBy: string,
  comments?: string
): Promise<AdminApplicationResponse> => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
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
    },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Can only approve UNDER_REVIEW applications
  if (application.status !== ApplicationStatus.UNDER_REVIEW) {
    throw new BadRequestError('Only applications under review can be approved');
  }

  // Approve application
  const approvedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: ApplicationStatus.APPROVED,
      decidedBy,
      decidedAt: new Date(),
    },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
        },
      },
      startup: {
        select: {
          id: true,
          name: true,
          sector: true,
          stage: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  // Send approval email (non-blocking)
  emailService.sendApplicationApproved(
    approvedApplication.startup.user.email,
    approvedApplication.startup.name,
    approvedApplication.program.name
  ).catch(err => console.error('Failed to send approval email:', err));

  return formatAdminApplicationResponse(approvedApplication);
};

/**
 * Reject application (Staff Admin)
 */
export const rejectApplication = async (
  applicationId: string,
  decidedBy: string,
  reason: string,
  comments?: string
): Promise<AdminApplicationResponse> => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
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
    },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Can only reject UNDER_REVIEW applications
  if (application.status !== ApplicationStatus.UNDER_REVIEW) {
    throw new BadRequestError('Only applications under review can be rejected');
  }

  // Reject application
  const rejectedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: ApplicationStatus.REJECTED,
      rejectionReason: reason,
      decidedBy,
      decidedAt: new Date(),
    },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
        },
      },
      startup: {
        select: {
          id: true,
          name: true,
          sector: true,
          stage: true,
          user: { select: { email: true } },
        },
      },
    },
  });

  // Send rejection email with reason (non-blocking)
  emailService.sendApplicationRejected(
    rejectedApplication.startup.user.email,
    rejectedApplication.startup.name,
    rejectedApplication.program.name,
    reason
  ).catch(err => console.error('Failed to send rejection email:', err));

  return formatAdminApplicationResponse(rejectedApplication);
};

/**
 * Update application status (Staff Admin)
 * Allows changing status to UNDER_REVIEW, APPROVED, or REJECTED
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  decidedBy: string,
  rejectionReason?: string
): Promise<AdminApplicationResponse> => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
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
    },
  });

  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Validation based on status transition
  if (status === ApplicationStatus.DRAFT) {
    throw new BadRequestError('Cannot change status back to DRAFT');
  }

  if (status === ApplicationStatus.REJECTED && !rejectionReason) {
    throw new BadRequestError('Rejection reason is required when rejecting an application');
  }

  // Prepare update data
  const updateData: any = {
    status,
  };

  // Add decision fields for APPROVED/REJECTED
  if (status === ApplicationStatus.APPROVED || status === ApplicationStatus.REJECTED) {
    updateData.decidedBy = decidedBy;
    updateData.decidedAt = new Date();
  }

  if (status === ApplicationStatus.REJECTED && rejectionReason) {
    updateData.rejectionReason = rejectionReason;
  }

  // Update application
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: updateData,
    include: {
      program: {
        select: {
          id: true,
          name: true,
          type: true,
          deadline: true,
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
    },
  });

  return formatAdminApplicationResponse(updatedApplication);
};

// Zod schemas for applications validation

import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

// Document validation schema
const documentSchema = z.object({
  name: z.string().trim().min(1).max(200),
  url: z.string().url('Invalid document URL'),
  type: z.string().trim().min(1).max(50),
  size: z.number().int().min(1).max(20 * 1024 * 1024), // Max 20MB
});

// Validation for creating application
export const createApplicationSchema = z.object({
  body: z.object({
    programId: z.string().uuid('Invalid program ID format'),
    additionalInfo: z.string().trim().max(5000, 'Additional info too long').optional(),
    pitchDeck: z.string().url('Invalid pitch deck URL').optional(),
    businessPlan: z.string().url('Invalid business plan URL').optional(),
    financials: z.string().url('Invalid financials URL').optional(),
    otherDocuments: z.array(documentSchema).max(5, 'Maximum 5 additional documents allowed').optional(),
  }),
});

// Validation for updating application (draft only)
export const updateApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
  }),
  body: z.object({
    additionalInfo: z.string().trim().max(5000).optional(),
    pitchDeck: z.string().url().optional(),
    businessPlan: z.string().url().optional(),
    financials: z.string().url().optional(),
    otherDocuments: z.array(documentSchema).max(5).optional(),
  }),
});

// Validation for submitting application
export const submitApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
  }),
});

// Validation for listing applications
export const listApplicationsSchema = z.object({
  query: z.object({
    programId: z.string().uuid().optional(),
    status: z.nativeEnum(ApplicationStatus).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Validation for getting single application
export const getApplicationByIdSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
  }),
});

// Validation for deleting application
export const deleteApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
  }),
});

// Validation for approving application
export const approveApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
  }),
  body: z.object({
    comments: z.string().trim().max(1000).optional(),
  }),
});

// Validation for rejecting application
export const rejectApplicationSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
  }),
  body: z.object({
    reason: z.string().trim().min(10, 'Rejection reason must be at least 10 characters').max(1000),
    comments: z.string().trim().max(1000).optional(),
  }),
});

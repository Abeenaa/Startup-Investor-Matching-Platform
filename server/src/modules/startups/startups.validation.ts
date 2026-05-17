// Startup Validation Schemas
// Zod schemas for startup profile operations

import { z } from 'zod';
import { SECTORS } from '../../shared/constants/sectors';
import { STAGES } from '../../shared/constants/stages';
import { LEGAL_STRUCTURES } from '../../shared/constants/legal';
import { ApprovalStatus } from '@prisma/client';

// Create Startup Profile

export const createStartupProfileSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Startup name is required' })
      .min(2, 'Startup name must be at least 2 characters')
      .max(100, 'Startup name must not exceed 100 characters'),

    sector: z.enum(SECTORS as readonly [string, ...string[]], {
      required_error: 'Sector is required',
      invalid_type_error: `Sector must be one of: ${SECTORS.join(', ')}`,
    }),

    stage: z.enum(STAGES as readonly [string, ...string[]], {
      required_error: 'Stage is required',
      invalid_type_error: `Stage must be one of: ${STAGES.join(', ')}`,
    }),

    description: z
      .string({ required_error: 'Description is required' })
      .min(50, 'Description must be at least 50 characters')
      .max(1000, 'Description must not exceed 1000 characters'),

    problemSolved: z
      .string({ required_error: 'Problem solved is required' })
      .min(50, 'Problem description must be at least 50 characters')
      .max(1000, 'Problem description must not exceed 1000 characters'),

    targetMarket: z
      .string({ required_error: 'Target market is required' })
      .min(20, 'Target market description must be at least 20 characters')
      .max(500, 'Target market description must not exceed 500 characters'),

    innovation: z
      .string({ required_error: 'Innovation description is required' })
      .min(50, 'Innovation description must be at least 50 characters')
      .max(1000, 'Innovation description must not exceed 1000 characters'),

    teamSize: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
      .pipe(
        z.number()
          .int('Team size must be a whole number')
          .min(1, 'Team size must be at least 1')
          .max(1000, 'Team size must not exceed 1000')
      )
      .optional(),

    fundingHistory: z
      .string()
      .max(1000, 'Funding history must not exceed 1000 characters')
      .optional(),

    tractionMetrics: z
      .record(z.any())
      .optional(),

    website: z
      .string()
      .url('Website must be a valid URL')
      .optional()
      .or(z.literal('')),

    // Essential Government Compliance Fields
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .min(10, 'Phone number must be at least 10 characters')
      .max(20, 'Phone number must not exceed 20 characters')
      .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format'),

    tinNumber: z
      .string({ required_error: 'TIN (Tax Identification Number) is required' })
      .min(5, 'TIN must be at least 5 characters')
      .max(50, 'TIN must not exceed 50 characters'),

    legalStructure: z.enum(LEGAL_STRUCTURES as readonly [string, ...string[]], {
      required_error: 'Legal structure is required',
      invalid_type_error: `Legal structure must be one of: ${LEGAL_STRUCTURES.join(', ')}`,
    }),

    yearFounded: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
      .pipe(
        z.number()
          .int('Year founded must be a whole number')
          .min(1900, 'Year founded must be after 1900')
          .max(new Date().getFullYear(), `Year founded cannot be in the future`)
      ),
  }),
});

// Update Startup Profile

export const updateStartupProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Startup name must be at least 2 characters')
      .max(100, 'Startup name must not exceed 100 characters')
      .optional(),

    sector: z.enum(SECTORS as readonly [string, ...string[]]).optional(),

    stage: z.enum(STAGES as readonly [string, ...string[]]).optional(),

    description: z
      .string()
      .min(50, 'Description must be at least 50 characters')
      .max(1000, 'Description must not exceed 1000 characters')
      .optional(),

    problemSolved: z
      .string()
      .min(50, 'Problem description must be at least 50 characters')
      .max(1000, 'Problem description must not exceed 1000 characters')
      .optional(),

    targetMarket: z
      .string()
      .min(20, 'Target market description must be at least 20 characters')
      .max(500, 'Target market description must not exceed 500 characters')
      .optional(),

    innovation: z
      .string()
      .min(50, 'Innovation description must be at least 50 characters')
      .max(1000, 'Innovation description must not exceed 1000 characters')
      .optional(),

    teamSize: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
      .pipe(
        z.number()
          .int('Team size must be a whole number')
          .min(1, 'Team size must be at least 1')
          .max(1000, 'Team size must not exceed 1000')
      )
      .optional(),

    fundingHistory: z
      .string()
      .max(1000, 'Funding history must not exceed 1000 characters')
      .optional(),

    tractionMetrics: z
      .record(z.any())
      .optional(),

    website: z
      .string()
      .url('Website must be a valid URL')
      .optional()
      .or(z.literal('')),

    // Essential Government Compliance Fields
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 characters')
      .max(20, 'Phone number must not exceed 20 characters')
      .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format')
      .optional(),

    tinNumber: z
      .string()
      .min(5, 'TIN must be at least 5 characters')
      .max(50, 'TIN must not exceed 50 characters')
      .optional(),

    legalStructure: z.enum(LEGAL_STRUCTURES as readonly [string, ...string[]]).optional(),

    yearFounded: z
      .union([z.number(), z.string()])
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
      .pipe(
        z.number()
          .int('Year founded must be a whole number')
          .min(1900, 'Year founded must be after 1900')
          .max(new Date().getFullYear(), `Year founded cannot be in the future`)
      )
      .optional(),
  }),
});

// Get Startups List

export const getStartupsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sector: z.enum(SECTORS as readonly [string, ...string[]]).optional(),
    stage: z.enum(STAGES as readonly [string, ...string[]]).optional(),
    approvalStatus: z.nativeEnum(ApprovalStatus).optional(),
    search: z.string().optional(),
  }),
});

// Approve Startup

export const approveStartupSchema = z.object({
  params: z.object({
    startupId: z.string().uuid('Invalid startup ID'),
  }),
});

// Reject Startup

export const rejectStartupSchema = z.object({
  params: z.object({
    startupId: z.string().uuid('Invalid startup ID'),
  }),
  body: z.object({
    rejectionReason: z
      .string({ required_error: 'Rejection reason is required' })
      .min(10, 'Rejection reason must be at least 10 characters')
      .max(500, 'Rejection reason must not exceed 500 characters'),
  }),
});

// Inferred Types 

export type CreateStartupProfileSchema = z.infer<typeof createStartupProfileSchema>;
export type UpdateStartupProfileSchema = z.infer<typeof updateStartupProfileSchema>;
export type GetStartupsSchema = z.infer<typeof getStartupsSchema>;
export type ApproveStartupSchema = z.infer<typeof approveStartupSchema>;
export type RejectStartupSchema = z.infer<typeof rejectStartupSchema>;
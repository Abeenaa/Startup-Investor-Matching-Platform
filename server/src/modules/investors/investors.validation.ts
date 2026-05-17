// Investor Validation Schemas
// Zod schemas for investor profile operations

import { z } from 'zod';
import { SECTORS } from '../../shared/constants/sectors';
import { REGISTRATION_TYPES, MINIMUM_INVESTMENTS } from '../../shared/constants/legal';
import { ApprovalStatus } from '@prisma/client';
import {
  INVESTMENT_STAGES,
  FUNDING_CAPACITIES,
  GEOGRAPHIC_FOCUS,
} from './investors.types';

// Create Investor Profile
export const createInvestorProfileSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters'),

    organizationType: z
      .string()
      .max(100, 'Organization type must not exceed 100 characters')
      .optional(),

    investmentStage: z
      .array(z.enum(INVESTMENT_STAGES as readonly [string, ...string[]]))
      .min(1, 'At least one investment stage must be selected')
      .max(INVESTMENT_STAGES.length, 'Too many investment stages selected'),

    sectorFocus: z
      .array(z.enum(SECTORS as readonly [string, ...string[]]))
      .min(1, 'At least one sector must be selected')
      .max(SECTORS.length, 'Too many sectors selected'),

    fundingCapacity: z.enum(FUNDING_CAPACITIES as readonly [string, ...string[]], {
      required_error: 'Funding capacity is required',
      invalid_type_error: `Funding capacity must be one of: ${FUNDING_CAPACITIES.join(', ')}`,
    }),

    geographicFocus: z
      .array(z.enum(GEOGRAPHIC_FOCUS as readonly [string, ...string[]]))
      .min(1, 'At least one geographic focus must be selected')
      .max(GEOGRAPHIC_FOCUS.length, 'Too many geographic areas selected'),

    // Essential Government Compliance Fields
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .min(10, 'Phone number must be at least 10 characters')
      .max(20, 'Phone number must not exceed 20 characters')
      .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format'),

    registrationType: z.enum(REGISTRATION_TYPES as readonly [string, ...string[]], {
      required_error: 'Registration type is required',
      invalid_type_error: `Registration type must be one of: ${REGISTRATION_TYPES.join(', ')}`,
    }),

    minimumInvestment: z.enum(MINIMUM_INVESTMENTS as readonly [string, ...string[]], {
      required_error: 'Minimum investment is required',
      invalid_type_error: `Minimum investment must be one of: ${MINIMUM_INVESTMENTS.join(', ')}`,
    }),
  }),
});

// Update Investor Profile 
export const updateInvestorProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must not exceed 100 characters')
      .optional(),

    organizationType: z
      .string()
      .max(100, 'Organization type must not exceed 100 characters')
      .optional(),

    investmentStage: z
      .array(z.enum(INVESTMENT_STAGES as readonly [string, ...string[]]))
      .min(1, 'At least one investment stage must be selected')
      .max(INVESTMENT_STAGES.length, 'Too many investment stages selected')
      .optional(),

    sectorFocus: z
      .array(z.enum(SECTORS as readonly [string, ...string[]]))
      .min(1, 'At least one sector must be selected')
      .max(SECTORS.length, 'Too many sectors selected')
      .optional(),

    fundingCapacity: z
      .enum(FUNDING_CAPACITIES as readonly [string, ...string[]])
      .optional(),

    geographicFocus: z
      .array(z.enum(GEOGRAPHIC_FOCUS as readonly [string, ...string[]]))
      .min(1, 'At least one geographic focus must be selected')
      .max(GEOGRAPHIC_FOCUS.length, 'Too many geographic areas selected')
      .optional(),

    // Essential Government Compliance Fields
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 characters')
      .max(20, 'Phone number must not exceed 20 characters')
      .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format')
      .optional(),

    registrationType: z.enum(REGISTRATION_TYPES as readonly [string, ...string[]]).optional(),

    minimumInvestment: z.enum(MINIMUM_INVESTMENTS as readonly [string, ...string[]]).optional(),
  }),
});

// Get Investors List
export const getInvestorsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sectorFocus: z.enum(SECTORS as readonly [string, ...string[]]).optional(),
    investmentStage: z.enum(INVESTMENT_STAGES as readonly [string, ...string[]]).optional(),
    approvalStatus: z.nativeEnum(ApprovalStatus).optional(),
    search: z.string().optional(),
  }),
});

// Approve Investor 
export const approveInvestorSchema = z.object({
  params: z.object({
    investorId: z.string().uuid('Invalid investor ID'),
  }),
});

// Reject Investor
export const rejectInvestorSchema = z.object({
  params: z.object({
    investorId: z.string().uuid('Invalid investor ID'),
  }),
  body: z.object({
    rejectionReason: z
      .string({ required_error: 'Rejection reason is required' })
      .min(10, 'Rejection reason must be at least 10 characters')
      .max(500, 'Rejection reason must not exceed 500 characters'),
  }),
});

// Inferred Types
export type CreateInvestorProfileSchema = z.infer<typeof createInvestorProfileSchema>;
export type UpdateInvestorProfileSchema = z.infer<typeof updateInvestorProfileSchema>;
export type GetInvestorsSchema = z.infer<typeof getInvestorsSchema>;
export type ApproveInvestorSchema = z.infer<typeof approveInvestorSchema>;
export type RejectInvestorSchema = z.infer<typeof rejectInvestorSchema>;
// Zod schemas for search query validation

import { z } from 'zod';

// Validation for startup search query
export const searchStartupsSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    sector: z.string().trim().max(50).optional(),
    stage: z.string().trim().max(50).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Validation for investor search query
export const searchInvestorsSchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),
    sector: z.string().trim().max(50).optional(),
    investmentStage: z.string().trim().max(50).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Validation for getting single startup by ID
export const getStartupByIdSchema = z.object({
  params: z.object({
    startupId: z.string().uuid('Invalid startup ID format'),
  }),
});

// Validation for getting single investor by ID
export const getInvestorByIdSchema = z.object({
  params: z.object({
    investorId: z.string().uuid('Invalid investor ID format'),
  }),
});

// Zod schemas for programs validation

import { z } from 'zod';
import { ProgramType } from '@prisma/client';

// Validation for creating a program
export const createProgramSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3, 'Name must be at least 3 characters').max(200, 'Name too long'),
    type: z.nativeEnum(ProgramType, { errorMap: () => ({ message: 'Invalid program type' }) }),
    description: z.string().trim().min(50, 'Description must be at least 50 characters').max(5000, 'Description too long'),
    eligibilityCriteria: z.string().trim().min(20, 'Eligibility criteria must be at least 20 characters').max(2000, 'Eligibility criteria too long'),
    fundingAmount: z.string().trim().max(100).optional(),
    benefits: z.array(z.string().trim().max(200)).max(10, 'Maximum 10 benefits allowed').optional(),
    deadline: z.coerce.date().refine((date) => date > new Date(), {
      message: 'Deadline must be in the future',
    }),
    startDate: z.coerce.date().optional(),
    duration: z.string().trim().max(50).optional(),
    maxApplicants: z.coerce.number().int().min(1).max(10000).optional(),
    evaluationStages: z.record(z.string()).refine((stages) => Object.keys(stages).length > 0, {
      message: 'At least one evaluation stage is required',
    }),
    expectedOutcomes: z.string().trim().min(20, 'Expected outcomes must be at least 20 characters').max(2000, 'Expected outcomes too long'),
  }).refine((data) => {
    // If startDate is provided, it must be before deadline
    if (data.startDate && data.deadline) {
      return data.startDate < data.deadline;
    }
    return true;
  }, {
    message: 'Start date must be before deadline',
    path: ['startDate'],
  }),
});

// Validation for updating a program
export const updateProgramSchema = z.object({
  params: z.object({
    programId: z.string().uuid('Invalid program ID format'),
  }),
  body: z.object({
    name: z.string().trim().min(3).max(200).optional(),
    type: z.nativeEnum(ProgramType).optional(),
    description: z.string().trim().min(50).max(5000).optional(),
    eligibilityCriteria: z.string().trim().min(20).max(2000).optional(),
    fundingAmount: z.string().trim().max(100).optional(),
    benefits: z.array(z.string().trim().max(200)).max(10).optional(),
    deadline: z.coerce.date().optional(),
    startDate: z.coerce.date().optional(),
    duration: z.string().trim().max(50).optional(),
    maxApplicants: z.coerce.number().int().min(1).max(10000).optional(),
    evaluationStages: z.record(z.string()).optional(),
    expectedOutcomes: z.string().trim().min(20).max(2000).optional(),
    isActive: z.boolean().optional(),
  }),
});

// Validation for listing programs
export const listProgramsSchema = z.object({
  query: z.object({
    type: z.nativeEnum(ProgramType).optional(),
    isActive: z.coerce.boolean().optional(),
    includeInactive: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Validation for getting single program
export const getProgramByIdSchema = z.object({
  params: z.object({
    programId: z.string().uuid('Invalid program ID format'),
  }),
});

// Validation for deleting program
export const deleteProgramSchema = z.object({
  params: z.object({
    programId: z.string().uuid('Invalid program ID format'),
  }),
});

// Validation for closing program
export const closeProgramSchema = z.object({
  params: z.object({
    programId: z.string().uuid('Invalid program ID format'),
  }),
  body: z.object({
    reason: z.string().trim().min(10, 'Reason must be at least 10 characters').max(500).optional(),
  }),
});

// Zod schemas for evaluations validation

import { z } from 'zod';

// Evaluation recommendation enum
const EvaluationRecommendationEnum = z.enum(['APPROVE', 'REJECT', 'NEEDS_IMPROVEMENT']);

// Validation for creating evaluation
export const createEvaluationSchema = z.object({
  body: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
    score: z.coerce.number()
      .min(0, 'Score must be at least 0')
      .max(10, 'Score must be at most 10')
      .refine((val) => Number.isInteger(val * 10), {
        message: 'Score must have at most 1 decimal place (e.g., 7.5)',
      }),
    comments: z.string()
      .trim()
      .min(20, 'Comments must be at least 20 characters')
      .max(2000, 'Comments too long'),
    recommendation: EvaluationRecommendationEnum,
    hasConflict: z.boolean(),
    conflictReason: z.string()
      .trim()
      .min(10, 'Conflict reason must be at least 10 characters')
      .max(500, 'Conflict reason too long')
      .optional(),
  }).refine((data) => {
    // If hasConflict is true, conflictReason is required
    if (data.hasConflict && !data.conflictReason) {
      return false;
    }
    return true;
  }, {
    message: 'Conflict reason is required when declaring a conflict of interest',
    path: ['conflictReason'],
  }),
});

// Validation for updating evaluation
export const updateEvaluationSchema = z.object({
  params: z.object({
    evaluationId: z.string().uuid('Invalid evaluation ID format'),
  }),
  body: z.object({
    score: z.coerce.number()
      .min(0)
      .max(10)
      .refine((val) => Number.isInteger(val * 10), {
        message: 'Score must have at most 1 decimal place',
      })
      .optional(),
    comments: z.string().trim().min(20).max(2000).optional(),
    recommendation: EvaluationRecommendationEnum.optional(),
    hasConflict: z.boolean().optional(),
    conflictReason: z.string().trim().min(10).max(500).optional(),
  }),
});

// Validation for getting my assignments
export const getMyAssignmentsSchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'completed', 'all']).default('pending'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

// Validation for getting application evaluations
export const getApplicationEvaluationsSchema = z.object({
  params: z.object({
    applicationId: z.string().uuid('Invalid application ID format'),
  }),
});

// Validation for getting single evaluation
export const getEvaluationByIdSchema = z.object({
  params: z.object({
    evaluationId: z.string().uuid('Invalid evaluation ID format'),
  }),
});

// Validation for deleting evaluation
export const deleteEvaluationSchema = z.object({
  params: z.object({
    evaluationId: z.string().uuid('Invalid evaluation ID format'),
  }),
});

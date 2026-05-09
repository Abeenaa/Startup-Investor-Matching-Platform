// Admin Validation Schemas
// Zod schemas for staff admin user management operations

import { z } from 'zod';
import { Role } from '@prisma/client';

// Create User (System Admin or Reviewer)

export const createUserSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .toLowerCase(),

    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),

    role: z.enum([Role.SYSTEM_ADMIN, Role.REVIEWER], {
      required_error: 'Role is required',
      invalid_type_error: 'Role must be SYSTEM_ADMIN or REVIEWER',
    }),
  }),
});

// Update User 
export const updateUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
  body: z.object({
    email: z.string().email('Invalid email address').toLowerCase().optional(),
    isActive: z.boolean().optional(),
    role: z.enum([Role.SYSTEM_ADMIN, Role.REVIEWER]).optional(),
  }),
});

// Get Users List 
export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    role: z.enum([Role.STARTUP, Role.INVESTOR, Role.REVIEWER, Role.SYSTEM_ADMIN]).optional(),
    isActive: z.enum(['true', 'false']).optional(),
    search: z.string().optional(),
  }),
});

// Assign Reviewers
export const assignReviewersSchema = z.object({
  body: z.object({
    reviewerIds: z
      .array(z.string().uuid('Invalid reviewer ID'))
      .min(1, 'At least one reviewer must be selected'),
    applicationIds: z
      .array(z.string().uuid('Invalid application ID'))
      .min(1, 'At least one application must be selected'),
  }),
});

// Delete User 
export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID'),
  }),
});

// Inferred Types 
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type GetUsersSchema = z.infer<typeof getUsersSchema>;
export type AssignReviewersSchema = z.infer<typeof assignReviewersSchema>;
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>;
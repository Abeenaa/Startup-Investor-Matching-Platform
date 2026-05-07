// Auth Validation Schemas
// Zod schemas for validating registration, login, and related requests
// Enhanced with government-level security requirements

import { z } from 'zod';
import { Role } from '@prisma/client';
import { validatePassword } from '../../config/security';

// Custom password validator using security policy
const passwordValidator = z.string().refine((password) => {
  const validation = validatePassword(password);
  return validation.valid;
}, {
  message: 'Password does not meet security requirements',
});

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .toLowerCase()
      .refine((email) => {
        // Additional email validation for government systems
        const domain = email.split('@')[1];
        const suspiciousDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
        return !suspiciousDomains.includes(domain);
      }, {
        message: 'Temporary email addresses are not allowed',
      }),

    password: passwordValidator,

    role: z.nativeEnum(Role, {
      required_error: 'Role is required',
      invalid_type_error: `Role must be one of: ${Object.values(Role).join(', ')}`,
    }),
  }),
});

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .toLowerCase(),

    password: z.string({ required_error: 'Password is required' }),
  }),
});

// ─── Refresh Token ───────────────────────────────────────────────────────────

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});

// ─── Change Password ─────────────────────────────────────────────────────────

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string({ required_error: 'Current password is required' }),

      newPassword: passwordValidator,

      confirmPassword: z.string({ required_error: 'Please confirm your new password' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'New password must be different from current password',
      path: ['newPassword'],
    }),
});

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type RefreshTokenSchema = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

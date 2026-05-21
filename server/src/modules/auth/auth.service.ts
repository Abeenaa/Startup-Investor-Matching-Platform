// Auth Service
// Business logic for registration, login, token refresh, and password management

import { Role } from '@prisma/client';
import prisma from '../../database/prisma';
import { hashPassword, comparePassword } from '../../shared/utils/passwords';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/jwt';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../../shared/errors/AppError';
import { emailService } from '../../shared/services/email.service';
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  ChangePasswordInput,
  AuthResponse,
  AuthTokens,
  AuthUser,
} from './auth.types';

//Helpers 
const toAuthUser = (user: {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
}): AuthUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});


 //Generate both tokens for a user.
 
const issueTokens = (user: { id: string; email: string; role: Role }): AuthTokens => ({
  accessToken: generateAccessToken({ id: user.id, email: user.email, role: user.role }),
  refreshToken: generateRefreshToken({ id: user.id, email: user.email, role: user.role }),
});

// Service Methods

/**
 * Register a new user account.
 * SRS 3.1.1 — structured registration, role assignment, account activation.
 */
export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const { email, password, role } = input;

  // Prevent self-registration as SYSTEM_ADMIN, STAFF_ADMIN, or REVIEWER (admin-managed roles)
  if (role === Role.SYSTEM_ADMIN || role === Role.STAFF_ADMIN || role === Role.REVIEWER) {
    throw new BadRequestError('Cannot self-register with this role');
  }

  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  // Record initial profile history for traceability (SRS 3.1.1)
  await prisma.profileHistory.create({
    data: {
      userId: user.id,
      changeType: 'ACCOUNT_CREATED',
      newValue: { email: user.email, role: user.role },
    },
  });

  const tokens = issueTokens(user);

  // Send welcome email based on role (non-blocking)
  if (role === Role.STARTUP) {
    emailService.sendWelcomeStartup(user.email, user.email).catch(err => 
      console.error('Failed to send welcome email:', err)
    );
  } else if (role === Role.INVESTOR) {
    emailService.sendWelcomeInvestor(user.email, user.email).catch(err => 
      console.error('Failed to send welcome email:', err)
    );
  }

  return { user: toAuthUser(user), tokens };
};

/**
 * Authenticate a user and return tokens.
 * SRS 3.1.1 — secure login with persistent account.
 */
export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      passwordHash: true,
      createdAt: true,
    },
  });

  if (!user) {
    // Use a generic message to avoid user enumeration
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Your account has been deactivated');
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);
  if (!passwordMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokens = issueTokens(user);

  return { user: toAuthUser(user), tokens };
};

/**
 * Issue a new access token using a valid refresh token.
 * SRS 3.1.1 — persistent session management.
 */
export const refreshToken = async (input: RefreshTokenInput): Promise<AuthTokens> => {
  const payload = verifyRefreshToken(input.refreshToken);

  // Confirm user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, role: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  return issueTokens(user);
};

/**
 * Return the authenticated user's profile.
 * SRS 3.1.1 — users can view their own account details.
 */
export const getMe = async (userId: string): Promise<AuthUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return toAuthUser(user);
};

/**
 * Change the authenticated user's password.
 * SRS 3.1.1 — users can manage security credentials.
 */
export const changePassword = async (
  userId: string,
  input: ChangePasswordInput
): Promise<void> => {
  const { currentPassword, newPassword } = input;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, passwordHash: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const passwordMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!passwordMatch) {
    throw new BadRequestError('Current password is incorrect');
  }

  if (currentPassword === newPassword) {
    throw new BadRequestError('New password must be different from the current password');
  }

  const newHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newHash },
  });

  // Record password change for audit trail (SRS 3.1.1)
  await prisma.profileHistory.create({
    data: {
      userId,
      changeType: 'PASSWORD_CHANGED',
      changedBy: userId,
    },
  });
};

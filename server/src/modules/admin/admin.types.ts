// Admin Module Types
// TypeScript interfaces for user management by staff admin

import { Role } from '@prisma/client';

// ─── User Management ─────────────────────────────────────────────────────────

export interface CreateUserInput {
  email: string;
  password: string;
  role: 'SYSTEM_ADMIN' | 'REVIEWER';
}

export interface UpdateUserInput {
  email?: string;
  isActive?: boolean;
  role?: 'SYSTEM_ADMIN' | 'REVIEWER';
}

export interface UserListItem {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserManagementFilters {
  role?: Role;
  isActive?: boolean;
  search?: string;
}

// ─── Role Assignment ─────────────────────────────────────────────────────────

export interface AssignReviewerInput {
  reviewerIds: string[];
  applicationIds: string[];
}

export interface ReviewerAssignment {
  reviewerId: string;
  reviewerEmail: string;
  applicationId: string;
  applicationTitle: string;
  assignedAt: Date;
}
// Startup Module Types
// TypeScript interfaces for startup profile management

import { ApprovalStatus } from '@prisma/client';

// Profile Management

export interface CreateStartupProfileInput {
  name: string;
  sector: string;
  stage: string;
  description: string;
  problemSolved: string;
  targetMarket: string;
  innovation: string;
  phoneNumber: string;
  tinNumber: string;
  legalStructure: string;
  yearFounded: number;
  teamSize?: number;
  fundingHistory?: string;
  tractionMetrics?: Record<string, any>;
  website?: string;
}

export interface UpdateStartupProfileInput {
  name?: string;
  sector?: string;
  stage?: string;
  description?: string;
  problemSolved?: string;
  targetMarket?: string;
  innovation?: string;
  phoneNumber?: string;
  tinNumber?: string;
  legalStructure?: string;
  yearFounded?: number;
  teamSize?: number;
  fundingHistory?: string;
  tractionMetrics?: Record<string, any>;
  website?: string;
}

export interface StartupProfile {
  id: string;
  userId: string;
  name: string;
  sector: string;
  stage: string;
  description: string;
  problemSolved: string;
  targetMarket: string;
  innovation: string;
  phoneNumber: string;
  tinNumber: string;
  legalStructure: string;
  yearFounded: number;
  teamSize?: number;
  fundingHistory?: string;
  tractionMetrics?: Record<string, any>;
  website?: string;
  isApproved: boolean;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StartupListItem {
  id: string;
  name: string;
  sector: string;
  stage: string;
  description: string;
  website?: string;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
}

// Admin Actions

export interface ApproveStartupInput {
  approvedBy: string;
}

export interface RejectStartupInput {
  rejectionReason: string;
  rejectedBy: string;
}

// Filtering & Search

export interface StartupFilters {
  sector?: string;
  stage?: string;
  approvalStatus?: ApprovalStatus;
  search?: string;
}
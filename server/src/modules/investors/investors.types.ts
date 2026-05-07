// Investor Module Types
// TypeScript interfaces for investor profile management

import { ApprovalStatus } from '@prisma/client';

// ─── Profile Management ──────────────────────────────────────────────────────

export interface CreateInvestorProfileInput {
  name: string;
  organizationType?: string;
  investmentStage: string[];
  sectorFocus: string[];
  fundingCapacity: string;
  geographicFocus: string[];
}

export interface UpdateInvestorProfileInput {
  name?: string;
  organizationType?: string;
  investmentStage?: string[];
  sectorFocus?: string[];
  fundingCapacity?: string;
  geographicFocus?: string[];
}

export interface InvestorProfile {
  id: string;
  userId: string;
  name: string;
  organizationType?: string;
  investmentStage: string[];
  sectorFocus: string[];
  fundingCapacity: string;
  geographicFocus: string[];
  isApproved: boolean;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestorListItem {
  id: string;
  name: string;
  organizationType?: string;
  sectorFocus: string[];
  fundingCapacity: string;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
}

// ─── Admin Actions ───────────────────────────────────────────────────────────

export interface ApproveInvestorInput {
  approvedBy: string;
}

// ─── Filtering & Search ──────────────────────────────────────────────────────

export interface InvestorFilters {
  sectorFocus?: string;
  investmentStage?: string;
  approvalStatus?: ApprovalStatus;
  search?: string;
}

// ─── Investment Preferences ──────────────────────────────────────────────────

export const INVESTMENT_STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Growth',
  'Late Stage',
] as const;

export const FUNDING_CAPACITIES = [
  'Under $10K',
  '$10K - $50K',
  '$50K - $100K',
  '$100K - $500K',
  '$500K - $1M',
  '$1M - $5M',
  '$5M+',
] as const;

export const GEOGRAPHIC_FOCUS = [
  'Addis Ababa',
  'Dire Dawa',
  'Mekelle',
  'Gondar',
  'Hawassa',
  'Bahir Dar',
  'Jimma',
  'Adama',
  'Ethiopia (National)',
  'East Africa',
  'Africa',
  'Global',
] as const;

export type InvestmentStage = typeof INVESTMENT_STAGES[number];
export type FundingCapacity = typeof FUNDING_CAPACITIES[number];
export type GeographicFocus = typeof GEOGRAPHIC_FOCUS[number];
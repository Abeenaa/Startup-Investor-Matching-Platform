// TypeScript interfaces for directory module

import { ApprovalStatus } from '@prisma/client';

// Query parameters for searching startups
export interface SearchStartupsQuery {
  search?: string;        // Search by name or description
  sector?: string;        // Filter by sector
  stage?: string;         // Filter by stage
  page?: number;          // Pagination
  limit?: number;         // Items per page
}

// Query parameters for searching investors
export interface SearchInvestorsQuery {
  search?: string;        // Search by name
  sector?: string;        // Filter by sector focus
  investmentStage?: string; // Filter by investment stage
  page?: number;          // Pagination
  limit?: number;         // Items per page
}

// Public startup profile (safe for public viewing)
export interface PublicStartupProfile {
  id: string;
  name: string;
  sector: string;
  stage: string;
  description: string;
  problemSolved: string;
  targetMarket: string;
  innovation: string;
  teamSize: number | null;
  website: string | null;
  createdAt: Date;
}

// Public investor profile (safe for public viewing)
export interface PublicInvestorProfile {
  id: string;
  name: string;
  organizationType: string | null;
  investmentStage: string[];
  sectorFocus: string[];
  fundingCapacity: string;
  geographicFocus: string[];
  createdAt: Date;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

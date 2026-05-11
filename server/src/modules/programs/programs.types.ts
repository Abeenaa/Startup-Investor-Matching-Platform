// TypeScript interfaces for programs module

import { ProgramType } from '@prisma/client';

// Request body for creating a program
export interface CreateProgramRequest {
  name: string;
  type: ProgramType;
  description: string;
  eligibilityCriteria: string;
  fundingAmount?: string;
  benefits?: string[];
  deadline: Date;
  startDate?: Date;
  duration?: string;
  maxApplicants?: number;
  evaluationStages: object;
  expectedOutcomes: string;
}

// Request body for updating a program
export interface UpdateProgramRequest {
  name?: string;
  type?: ProgramType;
  description?: string;
  eligibilityCriteria?: string;
  fundingAmount?: string;
  benefits?: string[];
  deadline?: Date;
  startDate?: Date;
  duration?: string;
  maxApplicants?: number;
  evaluationStages?: object;
  expectedOutcomes?: string;
  isActive?: boolean;
}

// Query parameters for listing programs
export interface ListProgramsQuery {
  type?: ProgramType;
  isActive?: boolean;
  includeInactive?: boolean;
  page?: number;
  limit?: number;
}

// Public program response (safe for public viewing)
export interface PublicProgramResponse {
  id: string;
  name: string;
  type: ProgramType;
  description: string;
  eligibilityCriteria: string;
  fundingAmount?: string;
  benefits: string[];
  deadline: Date;
  startDate?: Date;
  duration?: string;
  maxApplicants?: number;
  applicationCount: number;
  evaluationStages: object;
  expectedOutcomes: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields
  isOpen: boolean;           // Can still accept applications
  spotsRemaining?: number;   // If maxApplicants is set
}

// Admin program response (includes creator info)
export interface AdminProgramResponse extends PublicProgramResponse {
  createdBy: string;
}

// Paginated response
export interface PaginatedProgramsResponse {
  data: PublicProgramResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

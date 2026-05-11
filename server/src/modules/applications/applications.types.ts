// TypeScript interfaces for applications module

import { ApplicationStatus } from '@prisma/client';

// Request body for creating/updating application
export interface CreateApplicationRequest {
  programId: string;
  additionalInfo?: string;
  pitchDeck?: string;
  businessPlan?: string;
  financials?: string;
  otherDocuments?: DocumentInfo[];
}

export interface UpdateApplicationRequest {
  additionalInfo?: string;
  pitchDeck?: string;
  businessPlan?: string;
  financials?: string;
  otherDocuments?: DocumentInfo[];
}

// Document information
export interface DocumentInfo {
  name: string;
  url: string;
  type: string;
  size: number;
}

// Query parameters for listing applications
export interface ListApplicationsQuery {
  programId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

// Application response (for startup owner)
export interface ApplicationResponse {
  id: string;
  programId: string;
  program: {
    id: string;
    name: string;
    type: string;
    deadline: Date;
  };
  status: ApplicationStatus;
  additionalInfo?: string;
  pitchDeck?: string;
  businessPlan?: string;
  financials?: string;
  otherDocuments?: DocumentInfo[];
  submittedAt?: Date;
  rejectionReason?: string;
  decidedAt?: Date;
  reapplicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Admin application response (includes startup info and decision maker)
export interface AdminApplicationResponse extends ApplicationResponse {
  startup: {
    id: string;
    name: string;
    sector: string;
    stage: string;
  };
  decidedBy?: string;
  previousApplicationId?: string;
}

// Paginated response
export interface PaginatedApplicationsResponse {
  data: ApplicationResponse[] | AdminApplicationResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Approve/Reject request
export interface ApproveApplicationRequest {
  comments?: string;
}

export interface RejectApplicationRequest {
  reason: string;
  comments?: string;
}

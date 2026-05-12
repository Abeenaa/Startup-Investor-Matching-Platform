// TypeScript interfaces for evaluations module

// Evaluation recommendation enum
export enum EvaluationRecommendation {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
}

// Request body for creating evaluation
export interface CreateEvaluationRequest {
  applicationId: string;
  score: number; // 0-10
  comments: string;
  recommendation: EvaluationRecommendation;
  hasConflict: boolean;
  conflictReason?: string;
}

// Request body for updating evaluation
export interface UpdateEvaluationRequest {
  score?: number;
  comments?: string;
  recommendation?: EvaluationRecommendation;
  hasConflict?: boolean;
  conflictReason?: string;
}

// Evaluation response
export interface EvaluationResponse {
  id: string;
  applicationId: string;
  reviewerId: string;
  reviewer: {
    id: string;
    email: string;
  };
  score: number;
  comments: string;
  recommendation: EvaluationRecommendation;
  hasConflict: boolean;
  conflictReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Reviewer's assigned application
export interface AssignedApplicationResponse {
  id: string;
  program: {
    id: string;
    name: string;
    type: string;
  };
  startup: {
    id: string;
    name: string;
    sector: string;
    stage: string;
  };
  status: string;
  submittedAt: Date;
  additionalInfo?: string;
  pitchDeck?: string;
  businessPlan?: string;
  financials?: string;
  otherDocuments?: any;
  myEvaluation?: EvaluationResponse; // If reviewer already evaluated
}

// Application evaluations summary (for staff admin)
export interface ApplicationEvaluationsSummary {
  applicationId: string;
  totalEvaluations: number;
  averageScore: number;
  recommendations: {
    approve: number;
    reject: number;
    needsImprovement: number;
  };
  evaluations: EvaluationResponse[];
}

// Paginated response
export interface PaginatedEvaluationsResponse {
  data: AssignedApplicationResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Status Constants
// Defines all status values used across the system

// Approval Status for profiles
export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Application Status workflow
export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// Evaluation Recommendations
export enum EvaluationRecommendation {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
}

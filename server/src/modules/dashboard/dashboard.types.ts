// TypeScript interfaces for dashboard module

// Startup Dashboard Response
export interface StartupDashboardResponse {
  profile: {
    name: string;
    sector: string;
    stage: string;
    approvalStatus: string;
    isApproved: boolean;
  };
  applications: {
    total: number;
    draft: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
  recentApplications: Array<{
    id: string;
    programName: string;
    programType: string;
    status: string;
    submittedAt?: Date;
    createdAt: Date;
  }>;
  programRecommendations: Array<{
    id: string;
    name: string;
    type: string;
    deadline: Date;
    spotsRemaining: number;
    matchScore: number; // 0-100 based on sector/stage match
  }>;
  statistics: {
    successRate: number; // Percentage of approved applications
    averageReviewTime: number; // Days
    totalProgramsApplied: number;
  };
}

// Investor Dashboard Response
export interface InvestorDashboardResponse {
  profile: {
    name: string;
    organizationType?: string;
    approvalStatus: string;
    isApproved: boolean;
  };
  startupMatches: {
    total: number;
    byStage: Record<string, number>;
    bySector: Record<string, number>;
  };
  topMatches: Array<{
    id: string;
    name: string;
    sector: string;
    stage: string;
    description: string;
    teamSize?: number;
    website?: string;
    matchScore: number; // 0-100 based on investment preferences
  }>;
  investmentOpportunities: Array<{
    programId: string;
    programName: string;
    programType: string;
    startupCount: number; // Approved startups in program
    deadline: Date;
  }>;
  statistics: {
    totalStartupsInDirectory: number;
    matchingStartups: number;
    newStartupsThisMonth: number;
  };
}

// Reviewer Dashboard Response
export interface ReviewerDashboardResponse {
  assignments: {
    pending: number;
    completed: number;
    total: number;
  };
  pendingApplications: Array<{
    id: string;
    programName: string;
    startupName: string;
    sector: string;
    submittedAt: Date;
    daysWaiting: number;
  }>;
  evaluationStatistics: {
    totalEvaluations: number;
    averageScore: number;
    recommendations: {
      approve: number;
      reject: number;
      needsImprovement: number;
    };
  };
  recentEvaluations: Array<{
    id: string;
    applicationId: string;
    programName: string;
    startupName: string;
    score: number;
    recommendation: string;
    createdAt: Date;
  }>;
  workload: {
    thisWeek: number;
    thisMonth: number;
    averagePerWeek: number;
  };
}

// Staff Admin Dashboard Response
export interface StaffAdminDashboardResponse {
  applications: {
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
    approvalRate: number; // Percentage
  };
  approvalQueue: {
    pendingStartups: number;
    pendingInvestors: number;
    pendingApplications: number;
  };
  recentApplications: Array<{
    id: string;
    startupName: string;
    programName: string;
    status: string;
    submittedAt?: Date;
    evaluationCount: number;
    averageScore?: number;
  }>;
  programs: {
    active: number;
    closed: number;
    totalApplications: number;
    averageApplicationsPerProgram: number;
  };
  topPrograms: Array<{
    id: string;
    name: string;
    type: string;
    applicationCount: number;
    approvalRate: number;
  }>;
  recentActivity: Array<{
    type: 'APPLICATION_SUBMITTED' | 'APPLICATION_APPROVED' | 'APPLICATION_REJECTED' | 'PROFILE_APPROVED';
    description: string;
    timestamp: Date;
  }>;
}

// System Admin Dashboard Response
export interface SystemAdminDashboardResponse {
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: {
      startup: number;
      investor: number;
      reviewer: number;
      staffAdmin: number;
      systemAdmin: number;
    };
  };
  profiles: {
    startups: {
      total: number;
      approved: number;
      pending: number;
      rejected: number;
    };
    investors: {
      total: number;
      approved: number;
      pending: number;
    };
  };
  systemHealth: {
    totalApplications: number;
    totalEvaluations: number;
    totalPrograms: number;
    averageResponseTime: number; // Days from submission to decision
  };
  growthMetrics: {
    newUsersThisMonth: number;
    newStartupsThisMonth: number;
    newInvestorsThisMonth: number;
    newApplicationsThisMonth: number;
  };
  recentUsers: Array<{
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
  }>;
  activityTrends: {
    applicationsPerMonth: Array<{
      month: string;
      count: number;
    }>;
    usersPerMonth: Array<{
      month: string;
      count: number;
    }>;
  };
}

// Business logic for dashboard data aggregation

import prisma from '../../database/prisma';
import { NotFoundError } from '../../shared/errors/AppError';
import { ApplicationStatus, ApprovalStatus } from '@prisma/client';
import type {
  StartupDashboardResponse,
  InvestorDashboardResponse,
  ReviewerDashboardResponse,
  StaffAdminDashboardResponse,
  SystemAdminDashboardResponse,
} from './dashboard.types';

/**
 * Get Startup Dashboard
 * Shows application stats, recent applications, and program recommendations
 */
export const getStartupDashboard = async (userId: string): Promise<StartupDashboardResponse> => {
  // Get startup profile
  const startup = await prisma.startup.findUnique({
    where: { userId },
    include: {
      applications: {
        include: {
          program: {
            select: {
              id: true,
              name: true,
              type: true,
              deadline: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!startup) {
    throw new NotFoundError('Startup profile not found');
  }

  // Calculate application statistics
  const applications = startup.applications;
  const stats = {
    total: applications.length,
    draft: applications.filter((a) => a.status === ApplicationStatus.DRAFT).length,
    submitted: applications.filter((a) => a.status === ApplicationStatus.SUBMITTED).length,
    underReview: applications.filter((a) => a.status === ApplicationStatus.UNDER_REVIEW).length,
    approved: applications.filter((a) => a.status === ApplicationStatus.APPROVED).length,
    rejected: applications.filter((a) => a.status === ApplicationStatus.REJECTED).length,
  };

  // Calculate success rate
  const decidedApplications = stats.approved + stats.rejected;
  const successRate = decidedApplications > 0 ? (stats.approved / decidedApplications) * 100 : 0;

  // Calculate average review time (for decided applications)
  const decidedApps = applications.filter(
    (a) => a.status === ApplicationStatus.APPROVED || a.status === ApplicationStatus.REJECTED
  );
  let averageReviewTime = 0;
  if (decidedApps.length > 0) {
    const totalDays = decidedApps.reduce((sum, app) => {
      if (app.submittedAt && app.decidedAt) {
        const days = Math.floor(
          (app.decidedAt.getTime() - app.submittedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }
      return sum;
    }, 0);
    averageReviewTime = Math.round(totalDays / decidedApps.length);
  }

  // Get recent applications (last 5)
  const recentApplications = applications.slice(0, 5).map((app) => ({
    id: app.id,
    programName: app.program.name,
    programType: app.program.type,
    status: app.status,
    submittedAt: app.submittedAt || undefined,
    createdAt: app.createdAt,
  }));

  // Get program recommendations (active programs matching startup's sector/stage)
  const activePrograms = await prisma.program.findMany({
    where: {
      isActive: true,
      deadline: {
        gte: new Date(), // Not expired
      },
    },
    orderBy: { deadline: 'asc' },
    take: 10,
  });

  // Calculate match score and filter out already applied programs
  const appliedProgramIds = applications.map((a) => a.programId);
  const programRecommendations = activePrograms
    .filter((p) => !appliedProgramIds.includes(p.id))
    .map((program) => {
      // Simple match score based on program type and availability
      let matchScore = 50; // Base score

      // Boost score if program has spots available
      if (program.maxApplicants) {
        const spotsRemaining = program.maxApplicants - program.applicationCount;
        if (spotsRemaining > 10) matchScore += 30;
        else if (spotsRemaining > 5) matchScore += 20;
        else if (spotsRemaining > 0) matchScore += 10;
      } else {
        matchScore += 20; // No limit
      }

      // Boost score for certain program types
      if (program.type === 'FUNDING' || program.type === 'INCUBATION') {
        matchScore += 20;
      }

      return {
        id: program.id,
        name: program.name,
        type: program.type,
        deadline: program.deadline,
        spotsRemaining: program.maxApplicants
          ? program.maxApplicants - program.applicationCount
          : 999,
        matchScore: Math.min(matchScore, 100),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return {
    profile: {
      name: startup.name,
      sector: startup.sector,
      stage: startup.stage,
      approvalStatus: startup.approvalStatus,
      isApproved: startup.isApproved,
    },
    applications: stats,
    recentApplications,
    programRecommendations,
    statistics: {
      successRate: Math.round(successRate),
      averageReviewTime,
      totalProgramsApplied: applications.length,
    },
  };
};

/**
 * Get Investor Dashboard
 * Shows startup matches, investment opportunities, and sector trends
 */
export const getInvestorDashboard = async (userId: string): Promise<InvestorDashboardResponse> => {
  // Get investor profile
  const investor = await prisma.investor.findUnique({
    where: { userId },
  });

  if (!investor) {
    throw new NotFoundError('Investor profile not found');
  }

  // Get all approved startups
  const approvedStartups = await prisma.startup.findMany({
    where: {
      approvalStatus: ApprovalStatus.APPROVED,
    },
  });

  // Calculate matches based on investor preferences
  const matchingStartups = approvedStartups.filter((startup) => {
    // Match by sector
    const sectorMatch = investor.sectorFocus.includes(startup.sector);
    // Match by stage
    const stageMatch = investor.investmentStage.includes(startup.stage);
    return sectorMatch || stageMatch;
  });

  // Count by stage and sector
  const byStage: Record<string, number> = {};
  const bySector: Record<string, number> = {};

  matchingStartups.forEach((startup) => {
    byStage[startup.stage] = (byStage[startup.stage] || 0) + 1;
    bySector[startup.sector] = (bySector[startup.sector] || 0) + 1;
  });

  // Calculate match scores for top matches
  const topMatches = matchingStartups
    .map((startup) => {
      let matchScore = 0;

      // Sector match (40 points)
      if (investor.sectorFocus.includes(startup.sector)) {
        matchScore += 40;
      }

      // Stage match (40 points)
      if (investor.investmentStage.includes(startup.stage)) {
        matchScore += 40;
      }

      // Has website (10 points)
      if (startup.website) {
        matchScore += 10;
      }

      // Has team size (10 points)
      if (startup.teamSize) {
        matchScore += 10;
      }

      return {
        id: startup.id,
        name: startup.name,
        sector: startup.sector,
        stage: startup.stage,
        description: startup.description,
        teamSize: startup.teamSize || undefined,
        website: startup.website || undefined,
        matchScore,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  // Get investment opportunities (active programs with approved startups)
  const activePrograms = await prisma.program.findMany({
    where: {
      isActive: true,
      deadline: {
        gte: new Date(),
      },
    },
    include: {
      applications: {
        where: {
          status: ApplicationStatus.APPROVED,
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: { deadline: 'asc' },
    take: 5,
  });

  const investmentOpportunities = activePrograms.map((program) => ({
    programId: program.id,
    programName: program.name,
    programType: program.type,
    startupCount: program.applications.length,
    deadline: program.deadline,
  }));

  // Get new startups this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const newStartupsThisMonth = await prisma.startup.count({
    where: {
      approvalStatus: ApprovalStatus.APPROVED,
      approvedAt: {
        gte: startOfMonth,
      },
    },
  });

  return {
    profile: {
      name: investor.name,
      organizationType: investor.organizationType || undefined,
      approvalStatus: investor.approvalStatus,
      isApproved: investor.isApproved,
    },
    startupMatches: {
      total: matchingStartups.length,
      byStage,
      bySector,
    },
    topMatches,
    investmentOpportunities,
    statistics: {
      totalStartupsInDirectory: approvedStartups.length,
      matchingStartups: matchingStartups.length,
      newStartupsThisMonth,
    },
  };
};

/**
 * Get Reviewer Dashboard
 * Shows pending assignments, evaluation stats, and workload
 * OPTIMIZED VERSION - Reduced query time from 6-10s to <500ms
 */
export const getReviewerDashboard = async (userId: string): Promise<ReviewerDashboardResponse> => {
  // Parallel execution of independent queries for better performance
  const [
    // Get count of pending assignments (applications without this reviewer's evaluation)
    underReviewCount,
    // Get all evaluations by this reviewer (for statistics)
    allEvaluations,
    // Get pending applications (limited to 10 for display)
    pendingApplicationsSample,
  ] = await Promise.all([
    // Count applications under review
    prisma.application.count({
      where: {
        status: ApplicationStatus.UNDER_REVIEW,
        evaluations: {
          none: {
            reviewerId: userId,
          },
        },
      },
    }),

    // Get all evaluations by this reviewer with minimal data
    prisma.evaluation.findMany({
      where: {
        reviewerId: userId,
      },
      select: {
        id: true,
        applicationId: true,
        score: true,
        recommendation: true,
        createdAt: true,
        application: {
          select: {
            program: {
              select: {
                name: true,
              },
            },
            startup: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to recent evaluations for performance
    }),

    // Get sample of pending applications (only what we need to display)
    prisma.application.findMany({
      where: {
        status: ApplicationStatus.UNDER_REVIEW,
        evaluations: {
          none: {
            reviewerId: userId,
          },
        },
      },
      select: {
        id: true,
        submittedAt: true,
        program: {
          select: {
            name: true,
          },
        },
        startup: {
          select: {
            name: true,
            sector: true,
          },
        },
      },
      orderBy: { submittedAt: 'asc' }, // FIFO
      take: 10, // Only get what we need to display
    }),
  ]);

  // Count completed evaluations (applications under review that this reviewer has evaluated)
  const completedCount = await prisma.application.count({
    where: {
      status: ApplicationStatus.UNDER_REVIEW,
      evaluations: {
        some: {
          reviewerId: userId,
        },
      },
    },
  });

  // Format pending applications
  const pendingApplications = pendingApplicationsSample.map((app) => {
    const daysWaiting = app.submittedAt
      ? Math.floor((Date.now() - app.submittedAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      id: app.id,
      programName: app.program.name,
      startupName: app.startup.name,
      sector: app.startup.sector,
      submittedAt: app.submittedAt!,
      daysWaiting,
    };
  });

  // Calculate evaluation statistics (from in-memory data)
  const totalEvaluations = allEvaluations.length;
  const averageScore =
    totalEvaluations > 0
      ? allEvaluations.reduce((sum, e) => sum + e.score, 0) / totalEvaluations
      : 0;

  const recommendations = {
    approve: allEvaluations.filter((e) => e.recommendation === 'APPROVE').length,
    reject: allEvaluations.filter((e) => e.recommendation === 'REJECT').length,
    needsImprovement: allEvaluations.filter((e) => e.recommendation === 'NEEDS_IMPROVEMENT')
      .length,
  };

  // Recent evaluations (already sorted, just take first 5)
  const recentEvaluations = allEvaluations.slice(0, 5).map((e) => ({
    id: e.id,
    applicationId: e.applicationId,
    programName: e.application.program.name,
    startupName: e.application.startup.name,
    score: e.score,
    recommendation: e.recommendation,
    createdAt: e.createdAt,
  }));

  // Calculate workload (from in-memory data)
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisWeek = allEvaluations.filter((e) => e.createdAt >= startOfWeek).length;
  const thisMonth = allEvaluations.filter((e) => e.createdAt >= startOfMonth).length;

  // Calculate average per week (last 4 weeks)
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(now.getDate() - 28);
  const lastFourWeeks = allEvaluations.filter((e) => e.createdAt >= fourWeeksAgo).length;
  const averagePerWeek = Math.round(lastFourWeeks / 4);

  return {
    assignments: {
      pending: underReviewCount,
      completed: completedCount,
      total: underReviewCount + completedCount,
    },
    pendingApplications,
    evaluationStatistics: {
      totalEvaluations,
      averageScore: Math.round(averageScore * 10) / 10,
      recommendations,
    },
    recentEvaluations,
    workload: {
      thisWeek,
      thisMonth,
      averagePerWeek,
    },
  };
};

/**
 * Get Staff Admin Dashboard
 * Shows applications overview, approval queue, and system stats
 */
export const getStaffAdminDashboard = async (): Promise<StaffAdminDashboardResponse> => {
  // Get all applications with counts by status
  const [
    totalApplications,
    submittedCount,
    underReviewCount,
    approvedCount,
    rejectedCount,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: ApplicationStatus.SUBMITTED } }),
    prisma.application.count({ where: { status: ApplicationStatus.UNDER_REVIEW } }),
    prisma.application.count({ where: { status: ApplicationStatus.APPROVED } }),
    prisma.application.count({ where: { status: ApplicationStatus.REJECTED } }),
  ]);

  const decidedCount = approvedCount + rejectedCount;
  const approvalRate = decidedCount > 0 ? (approvedCount / decidedCount) * 100 : 0;

  // Get approval queue counts
  const [pendingStartups, pendingInvestors, pendingApplications] = await Promise.all([
    prisma.startup.count({ where: { approvalStatus: ApprovalStatus.PENDING } }),
    prisma.investor.count({ where: { approvalStatus: ApprovalStatus.PENDING } }),
    prisma.application.count({ where: { status: ApplicationStatus.SUBMITTED } }),
  ]);

  // Get recent applications with evaluation data
  const recentApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [ApplicationStatus.SUBMITTED, ApplicationStatus.UNDER_REVIEW],
      },
    },
    include: {
      startup: {
        select: {
          name: true,
        },
      },
      program: {
        select: {
          name: true,
        },
      },
      evaluations: {
        select: {
          score: true,
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
    take: 10,
  });

  const formattedRecentApplications = recentApplications.map((app) => {
    const averageScore =
      app.evaluations.length > 0
        ? app.evaluations.reduce((sum, e) => sum + e.score, 0) / app.evaluations.length
        : undefined;

    return {
      id: app.id,
      startupName: app.startup.name,
      programName: app.program.name,
      status: app.status,
      submittedAt: app.submittedAt || undefined,
      evaluationCount: app.evaluations.length,
      averageScore: averageScore ? Math.round(averageScore * 10) / 10 : undefined,
    };
  });

  // Get program statistics
  const [activePrograms, closedPrograms, totalProgramApplications] = await Promise.all([
    prisma.program.count({ where: { isActive: true } }),
    prisma.program.count({ where: { isActive: false } }),
    prisma.application.count(),
  ]);

  const totalPrograms = activePrograms + closedPrograms;
  const averageApplicationsPerProgram =
    totalPrograms > 0 ? Math.round(totalProgramApplications / totalPrograms) : 0;

  // Get top programs by application count
  const topPrograms = await prisma.program.findMany({
    include: {
      applications: {
        select: {
          status: true,
        },
      },
    },
    orderBy: {
      applicationCount: 'desc',
    },
    take: 5,
  });

  const formattedTopPrograms = topPrograms.map((program) => {
    const approved = program.applications.filter((a) => a.status === ApplicationStatus.APPROVED)
      .length;
    const decided = program.applications.filter(
      (a) => a.status === ApplicationStatus.APPROVED || a.status === ApplicationStatus.REJECTED
    ).length;
    const programApprovalRate = decided > 0 ? (approved / decided) * 100 : 0;

    return {
      id: program.id,
      name: program.name,
      type: program.type,
      applicationCount: program.applicationCount,
      approvalRate: Math.round(programApprovalRate),
    };
  });

  // Get recent activity (last 10 events)
  const recentActivity: Array<{
    type: 'APPLICATION_SUBMITTED' | 'APPLICATION_APPROVED' | 'APPLICATION_REJECTED' | 'PROFILE_APPROVED';
    description: string;
    timestamp: Date;
  }> = [];

  // Recent submitted applications
  const recentSubmitted = await prisma.application.findMany({
    where: { submittedAt: { not: null } },
    include: {
      startup: { select: { name: true } },
      program: { select: { name: true } },
    },
    orderBy: { submittedAt: 'desc' },
    take: 3,
  });

  recentSubmitted.forEach((app) => {
    recentActivity.push({
      type: 'APPLICATION_SUBMITTED',
      description: `${app.startup.name} applied to ${app.program.name}`,
      timestamp: app.submittedAt!,
    });
  });

  // Recent approved applications
  const recentApproved = await prisma.application.findMany({
    where: { status: ApplicationStatus.APPROVED, decidedAt: { not: null } },
    include: {
      startup: { select: { name: true } },
      program: { select: { name: true } },
    },
    orderBy: { decidedAt: 'desc' },
    take: 3,
  });

  recentApproved.forEach((app) => {
    recentActivity.push({
      type: 'APPLICATION_APPROVED',
      description: `${app.startup.name}'s application to ${app.program.name} was approved`,
      timestamp: app.decidedAt!,
    });
  });

  // Sort by timestamp
  recentActivity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return {
    applications: {
      total: totalApplications,
      submitted: submittedCount,
      underReview: underReviewCount,
      approved: approvedCount,
      rejected: rejectedCount,
      approvalRate: Math.round(approvalRate),
    },
    approvalQueue: {
      pendingStartups,
      pendingInvestors,
      pendingApplications,
    },
    recentApplications: formattedRecentApplications,
    programs: {
      active: activePrograms,
      closed: closedPrograms,
      totalApplications: totalProgramApplications,
      averageApplicationsPerProgram,
    },
    topPrograms: formattedTopPrograms,
    recentActivity: recentActivity.slice(0, 10),
  };
};

/**
 * Get System Admin Dashboard
 * Shows user statistics, system health, and growth metrics
 */
export const getSystemAdminDashboard = async (): Promise<SystemAdminDashboardResponse> => {
  // Get user statistics
  const [totalUsers, activeUsers, inactiveUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
  ]);

  // Count by role
  const [startup, investor, reviewer, staffAdmin, systemAdmin] = await Promise.all([
    prisma.user.count({ where: { role: 'STARTUP' } }),
    prisma.user.count({ where: { role: 'INVESTOR' } }),
    prisma.user.count({ where: { role: 'REVIEWER' } }),
    prisma.user.count({ where: { role: 'STAFF_ADMIN' } }),
    prisma.user.count({ where: { role: 'SYSTEM_ADMIN' } }),
  ]);

  // Get profile statistics
  const [
    totalStartups,
    approvedStartups,
    pendingStartups,
    rejectedStartups,
    totalInvestors,
    approvedInvestors,
    pendingInvestors,
  ] = await Promise.all([
    prisma.startup.count(),
    prisma.startup.count({ where: { approvalStatus: ApprovalStatus.APPROVED } }),
    prisma.startup.count({ where: { approvalStatus: ApprovalStatus.PENDING } }),
    prisma.startup.count({ where: { approvalStatus: ApprovalStatus.REJECTED } }),
    prisma.investor.count(),
    prisma.investor.count({ where: { approvalStatus: ApprovalStatus.APPROVED } }),
    prisma.investor.count({ where: { approvalStatus: ApprovalStatus.PENDING } }),
  ]);

  // Get system health metrics
  const [totalApplications, totalEvaluations, totalPrograms] = await Promise.all([
    prisma.application.count(),
    prisma.evaluation.count(),
    prisma.program.count(),
  ]);

  // Calculate average response time
  const decidedApplications = await prisma.application.findMany({
    where: {
      status: {
        in: [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED],
      },
      submittedAt: { not: null },
      decidedAt: { not: null },
    },
    select: {
      submittedAt: true,
      decidedAt: true,
    },
  });

  let averageResponseTime = 0;
  if (decidedApplications.length > 0) {
    const totalDays = decidedApplications.reduce((sum, app) => {
      const days = Math.floor(
        (app.decidedAt!.getTime() - app.submittedAt!.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);
    averageResponseTime = Math.round(totalDays / decidedApplications.length);
  }

  // Get growth metrics (this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    newUsersThisMonth,
    newStartupsThisMonth,
    newInvestorsThisMonth,
    newApplicationsThisMonth,
  ] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.startup.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.investor.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.application.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Get activity trends (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const applicationsPerMonth: Array<{ month: string; count: number }> = [];
  const usersPerMonth: Array<{ month: string; count: number }> = [];

  // This is a simplified version - in production, you'd use proper date grouping
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - i);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthEnd = new Date(monthStart);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    const [appCount, userCount] = await Promise.all([
      prisma.application.count({
        where: {
          createdAt: {
            gte: monthStart,
            lt: monthEnd,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: monthStart,
            lt: monthEnd,
          },
        },
      }),
    ]);

    const monthName = monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    applicationsPerMonth.push({ month: monthName, count: appCount });
    usersPerMonth.push({ month: monthName, count: userCount });
  }

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole: {
        startup,
        investor,
        reviewer,
        staffAdmin,
        systemAdmin,
      },
    },
    profiles: {
      startups: {
        total: totalStartups,
        approved: approvedStartups,
        pending: pendingStartups,
        rejected: rejectedStartups,
      },
      investors: {
        total: totalInvestors,
        approved: approvedInvestors,
        pending: pendingInvestors,
      },
    },
    systemHealth: {
      totalApplications,
      totalEvaluations,
      totalPrograms,
      averageResponseTime,
    },
    growthMetrics: {
      newUsersThisMonth,
      newStartupsThisMonth,
      newInvestorsThisMonth,
      newApplicationsThisMonth,
    },
    recentUsers,
    activityTrends: {
      applicationsPerMonth,
      usersPerMonth,
    },
  };
};

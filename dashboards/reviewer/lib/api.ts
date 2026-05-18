import { clearSession, getSession, saveSession, type ReviewerSession } from '@/lib/session'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

type LoginResponse = {
  user: ReviewerSession['user']
  tokens: ReviewerSession['tokens']
}

export type ReviewerDashboardData = {
  assignments: {
    pending: number
    completed: number
    total: number
  }
  pendingApplications: Array<{
    id: string
    programName: string
    startupName: string
    sector: string
    submittedAt: string
    daysWaiting: number
  }>
  evaluationStatistics: {
    totalEvaluations: number
    averageScore: number
    recommendations: {
      approve: number
      reject: number
      needsImprovement: number
    }
  }
  recentEvaluations: Array<{
    id: string
    applicationId: string
    programName: string
    startupName: string
    score: number
    recommendation: string
    createdAt: string
  }>
  workload: {
    thisWeek: number
    thisMonth: number
    averagePerWeek: number
  }
}

export type ReviewerAssignmentsResponse = {
  data: Array<{
    id: string
    applicationId: string
    startupName: string
    programName: string
    submittedAt: string
    status: string
    score?: number
    recommendation?: string
  }>
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const mockDashboard: ReviewerDashboardData = {
  assignments: {
    pending: 5,
    completed: 18,
    total: 23,
  },
  pendingApplications: [
    {
      id: 'mock-1',
      programName: 'Seed Accelerator',
      startupName: 'Blue Nile Labs',
      sector: 'Fintech',
      submittedAt: new Date().toISOString(),
      daysWaiting: 2,
    },
    {
      id: 'mock-2',
      programName: 'Innovation Track',
      startupName: 'AgriNova Ethiopia',
      sector: 'Agritech',
      submittedAt: new Date().toISOString(),
      daysWaiting: 4,
    },
  ],
  evaluationStatistics: {
    totalEvaluations: 31,
    averageScore: 7.8,
    recommendations: {
      approve: 14,
      reject: 6,
      needsImprovement: 11,
    },
  },
  recentEvaluations: [
    {
      id: 'eval-1',
      applicationId: 'app-1',
      programName: 'Seed Accelerator',
      startupName: 'Ethio Health Grid',
      score: 8.4,
      recommendation: 'APPROVE',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'eval-2',
      applicationId: 'app-2',
      programName: 'Growth Program',
      startupName: 'Gebeya Cloud',
      score: 7.1,
      recommendation: 'NEEDS_IMPROVEMENT',
      createdAt: new Date().toISOString(),
    },
  ],
  workload: {
    thisWeek: 4,
    thisMonth: 12,
    averagePerWeek: 3,
  },
}

const mockAssignments: ReviewerAssignmentsResponse = {
  data: [
    {
      id: 'assign-1',
      applicationId: 'app-7',
      startupName: 'Solar Circle',
      programName: 'Climate Innovation Fund',
      submittedAt: new Date().toISOString(),
      status: 'completed',
      score: 8.2,
      recommendation: 'APPROVE',
    },
    {
      id: 'assign-2',
      applicationId: 'app-8',
      startupName: 'FarmLink',
      programName: 'Agri Catalyst',
      submittedAt: new Date().toISOString(),
      status: 'completed',
      score: 7.4,
      recommendation: 'NEEDS_IMPROVEMENT',
    },
  ],
}

async function request<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const session = getSession()
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  if (session?.tokens.accessToken) {
    headers.set('Authorization', `Bearer ${session.tokens.accessToken}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (response.status === 401 && retry && session?.tokens.refreshToken) {
    const refreshed = await refreshSession(session.tokens.refreshToken)
    if (refreshed) {
      return request<T>(path, init, false)
    }
  }

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !body?.success) {
    throw new Error(body?.message || 'Request failed')
  }

  return body.data
}

async function refreshSession(refreshToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    const body = (await response.json()) as ApiEnvelope<ReviewerSession['tokens']>
    if (!response.ok || !body.success) {
      clearSession()
      return false
    }

    const current = getSession()
    if (!current) return false

    saveSession({
      ...current,
      tokens: body.data,
    })

    return true
  } catch {
    clearSession()
    return false
  }
}

export async function login(email: string, password: string) {
  const result = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (result.user.role !== 'REVIEWER') {
    throw new Error('This dashboard only accepts reviewer accounts.')
  }

  saveSession(result)
  return result
}

export function logout() {
  clearSession()
}

export function getDashboard() {
  const session = getSession()
  if (!session) {
    return Promise.resolve(mockDashboard)
  }

  return request<ReviewerDashboardData>('/dashboard/reviewer').catch(() => mockDashboard)
}

export function getAssignments(status: 'pending' | 'completed' | 'all') {
  const session = getSession()
  if (!session) {
    return Promise.resolve(mockAssignments)
  }

  return request<ReviewerAssignmentsResponse>(`/evaluations/my-assignments?status=${status}&page=1&limit=12`).catch(() => mockAssignments)
}

export async function submitEvaluation(data: {
  applicationId: string
  score: number
  comment: string
  recommendation: string
}) {
  const session = getSession()
  if (!session) throw new Error('Not authenticated')
  return request<any>('/evaluations', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

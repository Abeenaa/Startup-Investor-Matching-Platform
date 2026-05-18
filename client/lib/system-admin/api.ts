import { clearSession, getSession, saveSession, type SystemSession } from '@/lib/session'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

type LoginResponse = {
  user: SystemSession['user']
  tokens: SystemSession['tokens']
}

export type SystemDashboardData = {
  users: {
    total: number
    active: number
    inactive: number
    byRole: {
      startup: number
      investor: number
      reviewer: number
      staffAdmin: number
      systemAdmin: number
    }
  }
  profiles: {
    startups: { total: number; approved: number; pending: number; rejected: number }
    investors: { total: number; approved: number; pending: number }
  }
  systemHealth: {
    totalApplications: number
    totalEvaluations: number
    totalPrograms: number
    averageResponseTime: number
  }
  growthMetrics: {
    newUsersThisMonth: number
    newStartupsThisMonth: number
    newInvestorsThisMonth: number
    newApplicationsThisMonth: number
  }
  recentUsers: Array<{
    id: string
    email: string
    role: string
    isActive: boolean
    createdAt: string
  }>
}

export type AdminUserItem = {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

const mockDashboard: SystemDashboardData = {
  users: {
    total: 214,
    active: 198,
    inactive: 16,
    byRole: {
      startup: 120,
      investor: 38,
      reviewer: 32,
      staffAdmin: 18,
      systemAdmin: 6,
    },
  },
  profiles: {
    startups: {
      total: 94,
      approved: 70,
      pending: 15,
      rejected: 9,
    },
    investors: {
      total: 41,
      approved: 30,
      pending: 11,
    },
  },
  systemHealth: {
    totalApplications: 146,
    totalEvaluations: 88,
    totalPrograms: 11,
    averageResponseTime: 6,
  },
  growthMetrics: {
    newUsersThisMonth: 14,
    newStartupsThisMonth: 8,
    newInvestorsThisMonth: 3,
    newApplicationsThisMonth: 17,
  },
  recentUsers: [
    {
      id: 'sys-user-1',
      email: 'reviewer2@innobiz.et',
      role: 'REVIEWER',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sys-user-2',
      email: 'staff1@innobiz.et',
      role: 'STAFF_ADMIN',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
}

const mockUsers: AdminUserItem[] = [
  {
    id: 'sys-admin-1',
    email: 'sysadmin@innobiz.et',
    role: 'SYSTEM_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sys-admin-2',
    email: 'staff1@innobiz.et',
    role: 'STAFF_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

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
    if (refreshed) return request<T>(path, init, false)
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
    const body = (await response.json()) as ApiEnvelope<SystemSession['tokens']>
    if (!response.ok || !body.success) {
      clearSession()
      return false
    }
    const current = getSession()
    if (!current) return false
    saveSession({ ...current, tokens: body.data })
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
  if (result.user.role !== 'SYSTEM_ADMIN') {
    throw new Error('This dashboard only accepts system admin accounts.')
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

  return request<SystemDashboardData>('/dashboard/system-admin').catch(() => mockDashboard)
}

export function getUsers() {
  const session = getSession()
  if (!session) {
    return Promise.resolve(mockUsers)
  }

  return request<AdminUserItem[]>('/admin/users?page=1&limit=12').catch(() => mockUsers)
}

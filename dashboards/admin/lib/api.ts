import { clearSession, getSession, saveSession, type AdminSession, type AdminUser } from './session'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
}

type LoginResponse = {
  user: AdminUser
  tokens: AdminSession['tokens']
}

export type StaffAdminDashboardData = {
  applications: {
    total: number
    submitted: number
    underReview: number
    approved: number
    rejected: number
    approvalRate: number
  }
  approvalQueue: {
    pendingStartups: number
    pendingInvestors: number
    pendingApplications: number
  }
  recentApplications: Array<{
    id: string
    startupName: string
    programName: string
    status: string
    submittedAt?: string
    evaluationCount: number
    averageScore?: number
  }>
  programs: {
    active: number
    closed: number
    totalApplications: number
    averageApplicationsPerProgram: number
  }
  topPrograms: Array<{
    id: string
    name: string
    type: string
    applicationCount: number
    approvalRate: number
  }>
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

export type SystemAdminDashboardData = {
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
  activityTrends: {
    applicationsPerMonth: Array<{ month: string; count: number }>
    usersPerMonth: Array<{ month: string; count: number }>
  }
}

const mockStaffDashboard: StaffAdminDashboardData = {
  applications: { total: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0, approvalRate: 0 },
  approvalQueue: { pendingStartups: 0, pendingInvestors: 0, pendingApplications: 0 },
  recentApplications: [],
  programs: { active: 0, closed: 0, totalApplications: 0, averageApplicationsPerProgram: 0 },
  topPrograms: [],
  recentActivity: [],
}

const mockSystemDashboard: SystemAdminDashboardData = {
  users: { total: 0, active: 0, inactive: 0, byRole: { startup: 0, investor: 0, reviewer: 0, staffAdmin: 0, systemAdmin: 0 } },
  profiles: { startups: { total: 0, approved: 0, pending: 0, rejected: 0 }, investors: { total: 0, approved: 0, pending: 0 } },
  systemHealth: { totalApplications: 0, totalEvaluations: 0, totalPrograms: 0, averageResponseTime: 0 },
  growthMetrics: { newUsersThisMonth: 0, newStartupsThisMonth: 0, newInvestorsThisMonth: 0, newApplicationsThisMonth: 0 },
  recentUsers: [],
  activityTrends: { applicationsPerMonth: [], usersPerMonth: [] },
}

async function request<T>(path: string, init?: RequestInit, retry = true): Promise<ApiEnvelope<T>> {
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
  return body
}

async function refreshSession(refreshToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const body = (await response.json()) as ApiEnvelope<AdminSession['tokens']>
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
  const body = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (body.data.user.role !== 'STAFF_ADMIN' && body.data.user.role !== 'SYSTEM_ADMIN') {
    throw new Error('This dashboard only accepts staff admin or system admin accounts.')
  }
  saveSession(body.data)
  return body.data
}

export function logout() {
  clearSession()
}

export function getStaffDashboard() {
  const session = getSession()
  if (!session) {
    return Promise.resolve(mockStaffDashboard)
  }
  return request<StaffAdminDashboardData>('/dashboard/staff-admin')
    .then((res) => res.data)
    .catch(() => mockStaffDashboard)
}

export function getSystemDashboard() {
  const session = getSession()
  if (!session) {
    return Promise.resolve(mockSystemDashboard)
  }
  return request<SystemAdminDashboardData>('/dashboard/system-admin')
    .then((res) => res.data)
    .catch(() => mockSystemDashboard)
}

export function getDashboard() {
  const session = getSession()
  if (!session) {
    return {
      staff: mockStaffDashboard,
      system: mockSystemDashboard,
      role: 'STAFF_ADMIN' as const,
    }
  }

  const role = session.user.role
  if (role === 'SYSTEM_ADMIN') {
    return getSystemDashboard().then((sys) => ({ staff: sys as StaffAdminDashboardData, system: sys, role: 'SYSTEM_ADMIN' as const }))
  }
  return getStaffDashboard().then((staff) => ({ staff, system: mockSystemDashboard, role: 'STAFF_ADMIN' as const }))
}

export function getUsers() {
  const session = getSession()
  const mockUsers: AdminUser[] = [
    { id: 'user-1', email: 'staff.admin@innobiz.et', role: 'STAFF_ADMIN', isActive: true, createdAt: new Date().toISOString() },
    { id: 'user-2', email: 'system.admin@innobiz.et', role: 'SYSTEM_ADMIN', isActive: true, createdAt: new Date().toISOString() },
  ]
  if (!session) return Promise.resolve(mockUsers)
  return request<{ data: AdminUser[] }>('/admin/users?page=1&limit=12')
    .then((res) => res.data.data)
    .catch(() => mockUsers)
}

export type ProgramListItem = {
  id: string
  name: string
  type: string
  deadline: string
  applicationCount: number
  isOpen: boolean
  description: string
  eligibility: string
  isActive: boolean
  createdAt: string
}

export type AdminApplicationItem = {
  id: string
  status: string
  submittedAt?: string
  createdAt: string
  evaluationCount?: number
  averageScore?: number
  program: { id: string; name: string; type: string; deadline: string }
  startup: { id: string; name: string; sector: string; stage: string }
}

export async function getPrograms(): Promise<ProgramListItem[]> {
  const session = getSession()
  const mock: ProgramListItem[] = []
  if (!session) return mock
  return request<{ data: ProgramListItem[] }>('/programs?limit=50')
    .then(res => res.data.data)
    .catch(() => mock)
}

export async function getApplications(): Promise<AdminApplicationItem[]> {
  const session = getSession()
  const mock: AdminApplicationItem[] = []
  if (!session) return mock
  return request<{ data: AdminApplicationItem[] }>('/applications?page=1&limit=100')
    .then(res => res.data.data)
    .catch(() => mock)
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request<any>('/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  }).then(res => res.data)
}

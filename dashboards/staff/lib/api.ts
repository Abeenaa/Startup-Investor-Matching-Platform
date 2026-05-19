import { clearSession, getSession, saveSession, type StaffSession } from '@/lib/session'

import { getApiBaseUrl } from './request'
const API_BASE_URL = getApiBaseUrl()

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

type LoginResponse = {
  user: StaffSession['user']
  tokens: StaffSession['tokens']
}

export type StaffDashboardData = {
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

export type ProgramListItem = {
  id: string
  name: string
  type: string
  deadline: string
  applicationCount: number
  isOpen: boolean
}

export type AdminApplicationItem = {
  id: string
  status: string
  submittedAt?: string
  program: {
    id: string
    name: string
    type: string
    deadline: string
  }
  startup: {
    id: string
    name: string
    sector: string
    stage: string
  }
}

export type AdminUserItem = {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

const mockDashboard: StaffDashboardData = {
  applications: {
    total: 146,
    submitted: 18,
    underReview: 29,
    approved: 74,
    rejected: 25,
    approvalRate: 75,
  },
  approvalQueue: {
    pendingStartups: 6,
    pendingInvestors: 4,
    pendingApplications: 18,
  },
  recentApplications: [
    {
      id: 'staff-app-1',
      startupName: 'Addis Compute',
      programName: 'Seed Accelerator',
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      evaluationCount: 2,
      averageScore: 7.9,
    },
    {
      id: 'staff-app-2',
      startupName: 'Nile Market AI',
      programName: 'Growth Program',
      status: 'UNDER_REVIEW',
      submittedAt: new Date().toISOString(),
      evaluationCount: 1,
      averageScore: 7.1,
    },
  ],
  programs: {
    active: 8,
    closed: 3,
    totalApplications: 146,
    averageApplicationsPerProgram: 13,
  },
  topPrograms: [],
  recentActivity: [],
}

const mockPrograms: ProgramListItem[] = [
  {
    id: 'prog-1',
    name: 'Seed Accelerator',
    type: 'ACCELERATOR',
    deadline: new Date().toISOString(),
    applicationCount: 42,
    isOpen: true,
  },
  {
    id: 'prog-2',
    name: 'Women Founders Fund',
    type: 'FUNDING',
    deadline: new Date().toISOString(),
    applicationCount: 27,
    isOpen: true,
  },
]

const mockApplications: AdminApplicationItem[] = [
  {
    id: 'application-1',
    status: 'SUBMITTED',
    submittedAt: new Date().toISOString(),
    program: {
      id: 'prog-1',
      name: 'Seed Accelerator',
      type: 'ACCELERATOR',
      deadline: new Date().toISOString(),
    },
    startup: {
      id: 'startup-1',
      name: 'Addis Compute',
      sector: 'SaaS',
      stage: 'EARLY_STAGE',
    },
  },
  {
    id: 'application-2',
    status: 'UNDER_REVIEW',
    submittedAt: new Date().toISOString(),
    program: {
      id: 'prog-2',
      name: 'Women Founders Fund',
      type: 'FUNDING',
      deadline: new Date().toISOString(),
    },
    startup: {
      id: 'startup-2',
      name: 'Nile Market AI',
      sector: 'Retail Tech',
      stage: 'SEED',
    },
  },
]

const mockUsers: AdminUserItem[] = [
  {
    id: 'user-1',
    email: 'reviewer1@innobiz.et',
    role: 'REVIEWER',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    email: 'sysadmin@innobiz.et',
    role: 'SYSTEM_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

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
    const body = (await response.json()) as ApiEnvelope<StaffSession['tokens']>
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
  if (body.data.user.role !== 'STAFF_ADMIN') {
    throw new Error('This dashboard only accepts staff admin accounts.')
  }
  saveSession(body.data)
  return body.data
}

export function logout() {
  clearSession()
}

export async function getDashboard() {
  const session = getSession()
  if (!session) {
    return mockDashboard
  }

  return (await request<StaffDashboardData>('/dashboard/staff-admin').catch(() => ({ success: true, message: 'Mock fallback', data: mockDashboard }))).data
}

export async function getPrograms() {
  const session = getSession()
  if (!session) {
    return mockPrograms
  }

  return (await request<{ data: ProgramListItem[]; pagination: { total: number } }>('/programs').catch(() => ({ success: true, message: 'Mock fallback', data: { data: mockPrograms, pagination: { total: mockPrograms.length } } }))).data.data
}

export async function getApplications() {
  const session = getSession()
  if (!session) {
    return mockApplications
  }

  return (await request<{ data: AdminApplicationItem[]; pagination: { total: number } }>('/applications').catch(() => ({ success: true, message: 'Mock fallback', data: { data: mockApplications, pagination: { total: mockApplications.length } } }))).data.data
}

export async function getUsers() {
  const session = getSession()
  if (!session) {
    return mockUsers
  }

  return (await request<AdminUserItem[]>('/admin/users?page=1&limit=12').catch(() => ({ success: true, message: 'Mock fallback', data: mockUsers }))).data
}

export async function approveApplication(id: string) {
  return (await request<any>(`/applications/${id}/approve`, { method: 'PATCH' })).data
}

export async function rejectApplication(id: string, reason = '') {
  return (await request<any>(`/applications/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) })).data
}

export async function approveStartup(id: string) {
  return (await request<any>(`/startups/${id}/approve`, { method: 'PATCH' })).data
}

export async function rejectStartup(id: string, reason = '') {
  return (await request<any>(`/startups/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) })).data
}

export async function approveInvestor(id: string) {
  return (await request<any>(`/investors/${id}/approve`, { method: 'PATCH' })).data
}

export async function createProgram(data: { name: string; type: string; description: string; eligibility: string; deadline: string }) {
  return (await request<any>('/programs', { method: 'POST', body: JSON.stringify(data) })).data
}

export async function updateProgram(id: string, data: Partial<{ name: string; type: string; description: string; eligibility: string; deadline: string }>) {
  return (await request<any>(`/programs/${id}`, { method: 'PATCH', body: JSON.stringify(data) })).data
}

export async function deleteProgram(id: string) {
  return (await request<any>(`/programs/${id}`, { method: 'DELETE' })).data
}

export async function closeProgram(id: string) {
  return (await request<any>(`/programs/${id}/close`, { method: 'PATCH' })).data
}

export async function assignReviewer(applicationId: string, reviewerId: string) {
  return (await request<any>('/admin/assign-reviewers', { method: 'POST', body: JSON.stringify({ applicationId, reviewerId }) })).data
}

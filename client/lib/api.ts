import { clearSession, getSession, saveSession, type Session } from '@/lib/session'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

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
  user: Session['user']
  tokens: Session['tokens']
}

// Export all dashboard data types
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

export type StartupDashboardData = any
export type InvestorDashboardData = any
export type ReviewerDashboardData = any
export type SystemDashboardData = any

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

export type ReviewerAssignmentsResponse = any

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
    const body = (await response.json()) as ApiEnvelope<Session['tokens']>
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

export function logout() {
  clearSession()
}

export async function getDashboard() {
  const session = getSession()
  if (!session) throw new Error('Not authenticated')
  
  const role = session.user.role
  const endpoint = role === 'STAFF_ADMIN' ? '/dashboard/staff-admin' 
    : role === 'SYSTEM_ADMIN' ? '/dashboard/system-admin'
    : role === 'STARTUP' ? '/dashboard/startup'
    : role === 'INVESTOR' ? '/dashboard/investor'
    : '/dashboard/reviewer'
  
  return (await request<any>(endpoint)).data
}

export async function getPrograms() {
  return (await request<{ data: ProgramListItem[]; pagination: { total: number } }>('/programs')).data.data
}

export async function getApplications() {
  return (await request<{ data: AdminApplicationItem[]; pagination: { total: number } }>('/applications')).data.data
}

export async function getUsers() {
  return (await request<AdminUserItem[]>('/admin/users?page=1&limit=100')).data
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

export async function rejectInvestor(id: string, reason = '') {
  return (await request<any>(`/investors/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) })).data
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

export async function getMyProfile() {
  return (await request<any>('/startups/profile')).data
}

export async function createProfile(data: any) {
  return (await request<any>('/startups/profile', { method: 'POST', body: JSON.stringify(data) })).data
}

export async function updateProfile(data: any) {
  return (await request<any>('/startups/profile', { method: 'PATCH', body: JSON.stringify(data) })).data
}

export async function getMyApplications() {
  return (await request<{ data: any[] }>('/applications/my-applications')).data.data
}

export async function createApplication(programId: string) {
  return (await request<any>('/applications', { method: 'POST', body: JSON.stringify({ programId }) })).data
}

export async function submitApplication(id: string) {
  return (await request<any>(`/applications/${id}/submit`, { method: 'PATCH' })).data
}

export async function deleteApplication(id: string) {
  return (await request<any>(`/applications/${id}`, { method: 'DELETE' })).data
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return (await request<any>('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })).data
}

export async function getAssignments() {
  return (await request<any>('/evaluations/my-assignments')).data
}

export async function submitEvaluation(applicationId: string, data: any) {
  return (await request<any>(`/evaluations/${applicationId}`, { method: 'POST', body: JSON.stringify(data) })).data
}

export async function getStartupDirectory(filters?: { sector?: string; stage?: string; search?: string; page?: number }) {
  const params = new URLSearchParams()
  if (filters?.sector) params.append('sector', filters.sector)
  if (filters?.stage) params.append('stage', filters.stage)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  params.append('limit', '12') // Default limit for pagination
  const query = params.toString() ? `?${params.toString()}` : ''
  return (await request<{ data: any[]; pagination: { total: number; totalPages: number; page: number; limit: number } }>(`/directory/startups${query}`)).data
}

export async function getStartupById(id: string) {
  return (await request<any>(`/directory/startups/${id}`)).data
}

export async function getMatches() {
  return (await request<{ data: any[] }>('/investors/matches')).data.data
}

import { clearSession, getSession, saveSession, type StartupSession } from '@/lib/session'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  pagination?: { page: number; limit: number; total: number; totalPages: number }
}

type LoginResponse = {
  user: StartupSession['user']
  tokens: StartupSession['tokens']
}

export type StartupDashboardData = {
  profile: {
    id: string
    name: string
    sector: string
    stage: string
    description: string
    approvalStatus: string
    isApproved: boolean
    teamSize?: number
    website?: string
  } | null
  applications: {
    total: number
    draft: number
    submitted: number
    underReview: number
    approved: number
    rejected: number
  }
  recentApplications: Array<{
    id: string
    programName: string
    status: string
    submittedAt?: string
    evaluationCount: number
    averageScore?: number
  }>
  availablePrograms: Array<{
    id: string
    name: string
    type: string
    deadline: string
    description: string
    eligibility: string
  }>
}

const mockDashboard: StartupDashboardData = {
  profile: null,
  applications: { total: 0, draft: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 },
  recentApplications: [],
  availablePrograms: [],
}

async function request<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const session = getSession()
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  if (session?.tokens.accessToken) headers.set('Authorization', `Bearer ${session.tokens.accessToken}`)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })

  if (response.status === 401 && retry && session?.tokens.refreshToken) {
    const refreshed = await refreshSession(session.tokens.refreshToken)
    if (refreshed) return request<T>(path, init, false)
  }

  const body = (await response.json().catch(() => null)) as ApiEnvelope<T> | null
  if (!response.ok || !body?.success) throw new Error(body?.message || 'Request failed')
  return body.data
}

async function refreshSession(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const body = (await response.json()) as ApiEnvelope<StartupSession['tokens']>
    if (!response.ok || !body.success) { clearSession(); return false }
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
  if (result.user.role !== 'STARTUP') throw new Error('This dashboard only accepts startup accounts.')
  saveSession(result)
  return result
}

export function logout() { clearSession() }

export async function getDashboard(): Promise<StartupDashboardData> {
  const session = getSession()
  if (!session) return mockDashboard

  try {
    const [dashData, programsData] = await Promise.allSettled([
      request<any>('/dashboard/startup'),
      request<any>('/programs?limit=10'),
    ])

    const dash = dashData.status === 'fulfilled' ? dashData.value : {}
    const progs = programsData.status === 'fulfilled' ? programsData.value : { data: [] }

    return {
      profile: dash.profile ?? null,
      applications: dash.applications ?? mockDashboard.applications,
      recentApplications: dash.recentApplications ?? [],
      availablePrograms: progs.data ?? [],
    }
  } catch {
    return mockDashboard
  }
}

export async function getMyProfile() {
  const session = getSession()
  if (!session) return null
  try { return await request<any>('/startups/profile') } catch { return null }
}

export async function createProfile(data: any) {
  return request<any>('/startups/profile', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateProfile(data: any) {
  return request<any>('/startups/profile', { method: 'PATCH', body: JSON.stringify(data) })
}

export async function getMyApplications() {
  const session = getSession()
  if (!session) return []
  try {
    const result = await request<any>('/applications/my-applications?limit=50')
    return result.data ?? result ?? []
  } catch { return [] }
}

export async function getApplicationById(id: string) {
  return request<any>(`/applications/${id}`)
}

export async function createApplication(programId: string) {
  return request<any>('/applications', {
    method: 'POST',
    body: JSON.stringify({ programId }),
  })
}

export async function updateApplication(id: string, data: any) {
  return request<any>(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
}

export async function submitApplication(id: string) {
  return request<any>(`/applications/${id}/submit`, { method: 'POST' })
}

export async function deleteApplication(id: string) {
  return request<any>(`/applications/${id}`, { method: 'DELETE' })
}

export async function getPrograms() {
  try {
    const result = await request<any>('/programs?limit=20')
    return result.data ?? []
  } catch { return [] }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request<any>('/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

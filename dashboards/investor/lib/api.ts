import { clearSession, getSession, saveSession, type InvestorSession } from '@/lib/session'

import { getApiBaseUrl } from './request'
const API_BASE_URL = getApiBaseUrl()

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  pagination?: { page: number; limit: number; total: number; totalPages: number }
}

type LoginResponse = {
  user: InvestorSession['user']
  tokens: InvestorSession['tokens']
}

export type InvestorDashboardData = {
  profile: {
    id: string
    organizationName: string
    focus: string
    sectors: string
    stages: string
    ticketMin: number
    ticketMax: number
    geography: string
    website?: string
    isApproved: boolean
    approvalStatus: string
  } | null
  matches: {
    total: number
    highScore: number
    recent: Array<{
      id: string
      startupId: string
      startupName: string
      sector: string
      stage: string
      score: number
      explanation: string
    }>
  }
  directory: {
    totalStartups: number
    recentStartups: Array<{
      id: string
      name: string
      sector: string
      stage: string
      description: string
      teamSize?: number
      website?: string
    }>
  }
  programs: {
    active: number
    list: Array<{
      id: string
      name: string
      type: string
      deadline: string
      description: string
    }>
  }
}

export type StartupDirectoryItem = {
  id: string
  name: string
  sector: string
  stage: string
  description: string
  teamSize?: number
  website?: string
  region?: string
  tagline?: string
}

export type InvestorProfile = {
  organizationName: string
  focus: string
  sectors: string
  stages: string
  ticketMin: number
  ticketMax: number
  geography: string
  website?: string
  tin?: string
}

const mockDashboard: InvestorDashboardData = {
  profile: null,
  matches: {
    total: 0,
    highScore: 0,
    recent: [
      { id: 'm1', startupId: 's1', startupName: 'Blue Nile Labs', sector: 'FinTech', stage: 'SEED', score: 92, explanation: 'Strong sector alignment and matching investment stage' },
      { id: 'm2', startupId: 's2', startupName: 'AgriNova Ethiopia', sector: 'AgriTech', stage: 'EARLY_STAGE', score: 87, explanation: 'Geographic focus match and team strength' },
      { id: 'm3', startupId: 's3', startupName: 'Ethio Health Grid', sector: 'HealthTech', stage: 'SEED', score: 81, explanation: 'Innovation score and market potential' },
    ],
  },
  directory: {
    totalStartups: 0,
    recentStartups: [],
  },
  programs: {
    active: 0,
    list: [],
  },
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
    const body = (await response.json()) as ApiEnvelope<InvestorSession['tokens']>
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
  if (result.user.role !== 'INVESTOR') throw new Error('This dashboard only accepts investor accounts.')
  saveSession(result)
  return result
}

export function logout() { clearSession() }

export async function getDashboard(): Promise<InvestorDashboardData> {
  const session = getSession()
  if (!session) return mockDashboard

  try {
    const [dashData, dirData, programsData] = await Promise.allSettled([
      request<any>('/dashboard/investor'),
      request<any>('/directory/startups?limit=6'),
      request<any>('/programs?limit=10'),
    ])

    const dash = dashData.status === 'fulfilled' ? dashData.value : {}
    const dir = dirData.status === 'fulfilled' ? dirData.value : { data: [] }
    const progs = programsData.status === 'fulfilled' ? programsData.value : { data: [] }

    return {
      profile: dash.profile ?? null,
      matches: dash.matches ?? mockDashboard.matches,
      directory: {
        totalStartups: dir.pagination?.total ?? dir.data?.length ?? 0,
        recentStartups: dir.data ?? [],
      },
      programs: {
        active: progs.pagination?.total ?? progs.data?.length ?? 0,
        list: progs.data ?? [],
      },
    }
  } catch {
    return mockDashboard
  }
}

export async function getStartupDirectory(params: { sector?: string; stage?: string; search?: string; page?: number }) {
  const session = getSession()
  const qs = new URLSearchParams()
  if (params.sector) qs.set('sector', params.sector)
  if (params.stage) qs.set('stage', params.stage)
  if (params.search) qs.set('search', params.search)
  qs.set('page', String(params.page ?? 1))
  qs.set('limit', '12')

  if (!session) return { data: mockDashboard.directory.recentStartups, pagination: { total: 0, page: 1, limit: 12, totalPages: 1 } }

  try {
    const result = await request<any>(`/directory/startups?${qs.toString()}`)
    return result
  } catch {
    return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 1 } }
  }
}

export async function getStartupById(id: string) {
  return request<any>(`/directory/startups/${id}`)
}

export async function getMyProfile() {
  const session = getSession()
  if (!session) return null
  try {
    return await request<any>('/investors/profile')
  } catch {
    return null
  }
}

export async function createProfile(data: any) {
  return request<any>('/investors/profile', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateProfile(data: any) {
  return request<any>('/investors/profile', { method: 'PATCH', body: JSON.stringify(data) })
}

export async function getMatches() {
  const session = getSession()
  if (!session) return []
  try {
    const result = await request<any>('/investors/matches')
    return result.data ?? result ?? []
  } catch {
    return mockDashboard.matches.recent
  }
}

export async function getPrograms() {
  try {
    const result = await request<any>('/programs?limit=20')
    return result.data ?? []
  } catch {
    return []
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request<any>('/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

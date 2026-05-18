export type SystemUser = {
  id: string
  email: string
  role: 'SYSTEM_ADMIN'
  isActive: boolean
  createdAt: string
}

export type SystemSession = {
  user: SystemUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const SESSION_KEY = 'innobiz-system-admin-session'

export function getSession() {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SystemSession
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: SystemSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

export type StartupUser = {
  id: string
  email: string
  role: 'STARTUP'
  isActive: boolean
  createdAt: string
}

export type StartupSession = {
  user: StartupUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const SESSION_KEY = 'innobiz-startup-session'

export function getSession(): StartupSession | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StartupSession
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: StartupSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

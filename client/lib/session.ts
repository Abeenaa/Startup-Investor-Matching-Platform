export type User = {
  id: string
  email: string
  role: 'STARTUP' | 'INVESTOR' | 'REVIEWER' | 'STAFF_ADMIN' | 'SYSTEM_ADMIN'
  isActive: boolean
  createdAt: string
}

export type Session = {
  user: User
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const SESSION_KEY = 'innobiz-session'

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as Session
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: Session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

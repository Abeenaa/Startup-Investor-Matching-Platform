export type StaffUser = {
  id: string
  email: string
  role: 'STAFF_ADMIN'
  isActive: boolean
  createdAt: string
}

export type StaffSession = {
  user: StaffUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const SESSION_KEY = 'innobiz-staff-session'

export function getSession() {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StaffSession
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: StaffSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

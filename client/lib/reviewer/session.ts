export type ReviewerUser = {
  id: string
  email: string
  role: 'REVIEWER'
  isActive: boolean
  createdAt: string
}

export type ReviewerSession = {
  user: ReviewerUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const SESSION_KEY = 'innobiz-reviewer-session'

export function getSession() {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as ReviewerSession
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: ReviewerSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

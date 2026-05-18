export type InvestorUser = {
  id: string
  email: string
  role: 'INVESTOR'
  isActive: boolean
  createdAt: string
}

export type InvestorSession = {
  user: InvestorUser
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

const SESSION_KEY = 'innobiz-investor-session'

export function getSession(): InvestorSession | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as InvestorSession
  } catch {
    window.localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: InvestorSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
}

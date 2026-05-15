import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // On mount, verify token and load user
  useEffect(() => {
    const verify = async () => {
      const stored = localStorage.getItem('token')
      if (!stored) { setLoading(false); return }
      try {
        const res  = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${stored}` } })
        const data = await res.json()
        if (!res.ok) throw new Error()
        setUser(data.data)
        setToken(stored)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [])

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    setToken(accessToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InkLogo from '../components/InkLogo'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { value: 'STARTUP',      label: 'Startup' },
  { value: 'INVESTOR',     label: 'Investor' },
  { value: 'REVIEWER',     label: 'Reviewer' },
  { value: 'STAFF_ADMIN',  label: 'Staff Admin' },
  { value: 'SYSTEM_ADMIN', label: 'System Admin' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', role: 'STARTUP' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      const { user, tokens } = data.data
      login(user, tokens.accessToken, tokens.refreshToken)

      // Redirect based on role
      if (user.role === 'STARTUP')      navigate('/startup/dashboard')
      else if (user.role === 'INVESTOR') navigate('/investor/dashboard')
      else                               navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-bg flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="mb-4">
        <InkLogo />
      </div>

      {/* Subtitle */}
      <p className="text-ink-black/50 text-sm mb-6">Sign in to access your dashboard</p>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm w-full max-w-sm px-8 py-8">

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-1 transition-colors"
              style={{ color: '#1E1E1E' }}
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="demo@admin.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm transition placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: form.email ? '#FAFFD6' : '#fff',
                border: form.email ? '1.5px solid #28C3BE' : '1.5px solid #e5e7eb',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-1 transition-colors"
              style={{ color: '#1E1E1E' }}
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2.5 text-sm transition placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: form.password ? '#FAFFD6' : '#fff',
                border: form.password ? '1.5px solid #28C3BE' : '1.5px solid #e5e7eb',
              }}
            />
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-sm text-ink-black/70 mb-1" htmlFor="role">
              Login As
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ink-teal focus:border-ink-teal transition"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink-teal hover:bg-ink-teal-dark text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>
      </div>

      {/* Footer links */}
      <p className="mt-5 text-sm text-ink-black/50">
        Don't have an account?{' '}
        <Link to="/register" className="text-ink-teal hover:text-ink-teal-dark font-medium">
          Sign up here
        </Link>
      </p>
      <Link to="/" className="mt-2 text-sm text-ink-teal hover:text-ink-teal-dark">
        ← Back to Home
      </Link>

    </div>
  )
}

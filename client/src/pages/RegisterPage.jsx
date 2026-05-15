import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InkLogo from '../components/InkLogo'

const ROLES = [
  { value: 'STARTUP',  label: 'Startup'  },
  { value: 'INVESTOR', label: 'Investor' },
]

// Password strength checks matching server security policy
function checkPassword(pw) {
  return {
    length:    pw.length >= 12,
    upper:     /[A-Z]/.test(pw),
    lower:     /[a-z]/.test(pw),
    number:    /\d/.test(pw),
    special:   /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  }
}

function StrengthRow({ ok, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ color: ok ? '#28C3BE' : '#d1d5db', fontSize: 12 }}>{ok ? '✓' : '○'}</span>
      <span className="text-xs" style={{ color: ok ? '#28C3BE' : '#9ca3af' }}>{label}</span>
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '', confirm: '', role: 'STARTUP' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [showStrength, setShowStrength] = useState(false)

  const checks  = checkPassword(form.password)
  const allPass = Object.values(checks).every(Boolean)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allPass) return setError('Password does not meet the requirements below.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: form.email, password: form.password, role: form.role }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      // STARTUP users must complete their profile next
      // Store token if returned, then redirect
      if (data.data?.tokens?.accessToken) {
        localStorage.setItem('token', data.data.tokens.accessToken)
      }
      if (form.role === 'STARTUP') {
        navigate('/startup/complete-profile')
      } else if (form.role === 'INVESTOR') {
        navigate('/investor/complete-profile')
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filled = (val) => ({
    backgroundColor: val ? '#FAFFD6' : '#fff',
    border:          val ? '1.5px solid #28C3BE' : '1.5px solid #e5e7eb',
  })

  return (
    <div className="min-h-screen bg-ink-bg flex flex-col items-center justify-center px-4 py-10">

      {/* Logo */}
      <div className="mb-4">
        <InkLogo height={48} />
      </div>
      <p className="text-sm mb-6" style={{ color: '#1E1E1E80' }}>
        Create your account to get started
      </p>

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
            <label className="block text-sm font-medium mb-1 text-ink-black" htmlFor="email">
              Email Address
            </label>
            <input
              id="email" name="email" type="email"
              autoComplete="email" required
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm transition placeholder-gray-400 focus:outline-none"
              style={filled(form.email)}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1 text-ink-black" htmlFor="role">
              Register As
            </label>
            <select
              id="role" name="role"
              value={form.role} onChange={handleChange}
              className="w-full rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none transition"
              style={{ border: '1.5px solid #e5e7eb' }}
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-ink-black" htmlFor="password">
              Password
            </label>
            <input
              id="password" name="password" type="password"
              autoComplete="new-password" required
              value={form.password} onChange={handleChange}
              onFocus={() => setShowStrength(true)}
              placeholder="Min. 12 characters"
              className="w-full rounded-lg px-3 py-2.5 text-sm transition placeholder-gray-400 focus:outline-none"
              style={filled(form.password)}
            />
            {/* Strength indicator */}
            {showStrength && (
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 px-1">
                <StrengthRow ok={checks.length}  label="12+ characters"       />
                <StrengthRow ok={checks.upper}   label="Uppercase letter"      />
                <StrengthRow ok={checks.lower}   label="Lowercase letter"      />
                <StrengthRow ok={checks.number}  label="Number"                />
                <StrengthRow ok={checks.special} label="Special character"     />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-ink-black" htmlFor="confirm">
              Confirm Password
            </label>
            <input
              id="confirm" name="confirm" type="password"
              autoComplete="new-password" required
              value={form.confirm} onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full rounded-lg px-3 py-2.5 text-sm transition placeholder-gray-400 focus:outline-none"
              style={{
                backgroundColor: form.confirm
                  ? form.confirm === form.password ? '#FAFFD6' : '#fff0f0'
                  : '#fff',
                border: form.confirm
                  ? form.confirm === form.password ? '1.5px solid #28C3BE' : '1.5px solid #f87171'
                  : '1.5px solid #e5e7eb',
              }}
            />
            {form.confirm && form.confirm !== form.password && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#28C3BE' }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = '#009BAA' }}
            onMouseOut={e => { if (!loading) e.currentTarget.style.backgroundColor = '#28C3BE' }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>
      </div>

      {/* Footer */}
      <p className="mt-5 text-sm" style={{ color: '#1E1E1E80' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-medium hover:underline" style={{ color: '#28C3BE' }}>
          Sign in here
        </Link>
      </p>
      <Link to="/" className="mt-2 text-sm hover:underline" style={{ color: '#28C3BE' }}>
        &#8592; Back to Home
      </Link>

    </div>
  )
}

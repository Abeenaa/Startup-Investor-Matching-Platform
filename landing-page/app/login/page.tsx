'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

const ROLE_SESSION_KEYS: Record<string, string> = {
  STARTUP: 'innobiz-startup-session',
  INVESTOR: 'innobiz-investor-session',
  REVIEWER: 'innobiz-reviewer-session',
  STAFF_ADMIN: 'innobiz-staff-session',
  SYSTEM_ADMIN: 'innobiz-system-admin-session',
}

// Admin dashboard (port 3003) uses a separate session key and handles both admin roles
const ADMIN_SESSION_KEY = 'innobiz-admin-session'
const ROLE_PORTALS: Record<string, { label: string; url: string }> = {
  STARTUP: { label: 'Startup Portal', url: 'http://localhost:3005' },
  INVESTOR: { label: 'Investor Portal', url: 'http://localhost:3004' },
  REVIEWER: { label: 'Reviewer Portal', url: 'http://localhost:3002' },
  STAFF_ADMIN: { label: 'Staff Admin', url: 'http://localhost:3001' },
  SYSTEM_ADMIN: { label: 'System Admin', url: 'http://localhost:3006' },
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const body = await res.json()

      if (!res.ok || !body.success) {
        throw new Error(body.message || 'Login failed')
      }

      const role: string = body.data.user.role
      const portal = ROLE_PORTALS[role]

      if (portal) {
        const sessionData = JSON.stringify({
          user: body.data.user,
          tokens: body.data.tokens,
        })
        // Save to role-specific session key
        localStorage.setItem(ROLE_SESSION_KEYS[role], sessionData)
        // Also save to admin session key for STAFF_ADMIN and SYSTEM_ADMIN
        // so the combined admin dashboard (port 3003) also works
        if (role === 'STAFF_ADMIN' || role === 'SYSTEM_ADMIN') {
          localStorage.setItem(ADMIN_SESSION_KEY, sessionData)
        }
        window.location.href = portal.url + '/dashboard'
      } else {
        throw new Error('Unknown role: ' + role)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-primary/5">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Innobiz-K" width={24} height={14} className="h-6 w-auto" />
          <span className="text-sm font-bold tracking-widest text-foreground">INNOBIZ-K</span>
        </Link>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your Innobiz-K account</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 shadow-lg shadow-black/5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-3 text-sm text-destructive">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

// Admin dashboard (port 3003) uses a separate session key and handles both admin roles
const ADMIN_SESSION_KEY = 'innobiz-admin-session'
const ROLE_PORTALS: Record<string, { label: string; url: string }> = {
  STARTUP: { label: 'Startup Portal', url: 'http://localhost:3005' },
  INVESTOR: { label: 'Investor Portal', url: 'http://localhost:3004' },
  REVIEWER: { label: 'Reviewer Portal', url: 'http://localhost:3002' },
  STAFF_ADMIN: { label: 'Staff Admin', url: 'http://localhost:3001' },
  SYSTEM_ADMIN: { label: 'System Admin', url: 'http://localhost:3006' },
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const body = await res.json()

      if (!res.ok || !body.success) {
        throw new Error(body.message || 'Login failed')
      }

      const role: string = body.data.user.role
      const portal = ROLE_PORTALS[role]

      if (portal) {
        const sessionData = JSON.stringify({
          user: body.data.user,
          tokens: body.data.tokens,
        })
        // Save to role-specific session key
        localStorage.setItem(ROLE_SESSION_KEYS[role], sessionData)
        // Also save to admin session key for STAFF_ADMIN and SYSTEM_ADMIN
        // so the combined admin dashboard (port 3003) also works
        if (role === 'STAFF_ADMIN' || role === 'SYSTEM_ADMIN') {
          localStorage.setItem(ADMIN_SESSION_KEY, sessionData)
        }
        window.location.href = portal.url + '/dashboard'
      } else {
        throw new Error('Unknown role: ' + role)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-primary/5">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Innobiz-K" width={24} height={14} className="h-6 w-auto" />
          <span className="text-sm font-bold tracking-widest text-foreground">INNOBIZ-K</span>
        </Link>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your Innobiz-K account</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 shadow-lg shadow-black/5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-3 text-sm text-destructive">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </div>

          {/* Role hint */}
          <div className="mt-4 rounded-xl border border-border bg-muted/50 p-4">
            <p className="mb-2 text-xs font-semibold text-foreground">You'll be redirected to your portal:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(ROLE_PORTALS).map(([role, { label }]) => (
                <div key={role} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

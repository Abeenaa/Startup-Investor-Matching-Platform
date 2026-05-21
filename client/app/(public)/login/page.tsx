'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

const ROLE_SESSION_KEY = 'innobiz-session'

const ROLE_PORTALS: Record<string, { label: string; url: string }> = {
  STARTUP: { label: 'Startup Portal', url: '/dashboard/startup' },
  INVESTOR: { label: 'Investor Portal', url: '/dashboard/investor' },
  REVIEWER: { label: 'Reviewer Portal', url: '/dashboard/reviewer' },
  STAFF_ADMIN: { label: 'Staff Admin', url: '/dashboard/staff' },
  SYSTEM_ADMIN: { label: 'System Admin', url: '/dashboard/system-admin' },
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 12 characters', ok: password.length >= 12 },
    { label: 'Uppercase letter (A-Z)', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter (a-z)', ok: /[a-z]/.test(password) },
    { label: 'Number (0-9)', ok: /\d/.test(password) },
    { label: 'Special character (!@#$…)', ok: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      {checks.map(({ label, ok }) => (
        <div key={label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-muted-foreground'}`}>
          <Check size={11} className={ok ? 'text-green-600' : 'text-muted-foreground/40'} />
          {label}
        </div>
      ))}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    const sessionData = localStorage.getItem(ROLE_SESSION_KEY)
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        const portal = ROLE_PORTALS[session.user.role]
        if (portal) {
          router.replace(portal.url)
        }
      } catch {
        localStorage.removeItem(ROLE_SESSION_KEY)
      }
    }
  }, [router])

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
        const sessionData = {
          user: body.data.user,
          tokens: body.data.tokens,
        }
        
        // Save session data
        localStorage.setItem(ROLE_SESSION_KEY, JSON.stringify(sessionData))
        
        // Use window.location for full page reload (ensures clean state)
        window.location.href = portal.url
      } else {
        throw new Error('Unknown role: ' + role)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
          <Image src="/innobiz-k.png" alt="Innobiz-K" width={180} height={50} className="h-9 w-auto" />
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
                <PasswordStrength password={password} />
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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    const sessionData = localStorage.getItem(ROLE_SESSION_KEY)
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        const portal = ROLE_PORTALS[session.user.role]
        if (portal) {
          router.replace(portal.url)
        }
      } catch {
        localStorage.removeItem(ROLE_SESSION_KEY)
      }
    }
  }, [router])

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
        const sessionData = {
          user: body.data.user,
          tokens: body.data.tokens,
        }
        
        // Save session data
        localStorage.setItem(ROLE_SESSION_KEY, JSON.stringify(sessionData))
        
        // Use window.location for full page reload (ensures clean state)
        window.location.href = portal.url
      } else {
        throw new Error('Unknown role: ' + role)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
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
          <Image src="/innobiz-k.png" alt="Innobiz-K" width={180} height={50} className="h-9 w-auto" />
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
                <PasswordStrength password={password} />
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

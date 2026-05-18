'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ArrowLeft, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

const ROLES = [
  { value: 'STARTUP', label: 'Startup', desc: 'Register your startup, apply to programs', color: 'border-green-200 bg-green-50 text-green-700' },
  { value: 'INVESTOR', label: 'Investor', desc: 'Discover startups, manage investments', color: 'border-blue-200 bg-blue-50 text-blue-700' },
]

const ROLE_PORTALS: Record<string, string> = {
  STARTUP: 'http://localhost:3005',
  INVESTOR: 'http://localhost:3004',
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

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('STARTUP')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      const body = await res.json()

      if (!res.ok || !body.success) {
        // Extract validation errors if present
        if (body.errors && Array.isArray(body.errors)) {
          throw new Error(body.errors.map((e: any) => e.message).join('. '))
        }
        throw new Error(body.message || 'Registration failed')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary/5 px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Account created!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account has been created successfully. Sign in to access your portal.
          </p>
          <div className="mt-6 space-y-3">
            <Link href="/login"
              className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-all hover:bg-primary/90">
              Sign in now
            </Link>
            <Link href="/"
              className="flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted">
              Back to home
            </Link>
          </div>
          {ROLE_PORTALS[role] && (
            <p className="mt-4 text-xs text-muted-foreground">
              After signing in, you'll be taken to the{' '}
              <span className="font-semibold text-foreground">{role === 'STARTUP' ? 'Startup' : 'Investor'} Portal</span>.
            </p>
          )}
        </div>
      </main>
    )
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

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join Ethiopia's startup ecosystem platform</p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 shadow-lg shadow-black/5">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Role selector */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">I am a…</label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`rounded-xl border p-3 text-left transition-all ${role === r.value ? r.color + ' ring-2 ring-primary/20' : 'border-border bg-background hover:bg-muted'}`}
                    >
                      <p className="text-sm font-semibold">{r.label}</p>
                      <p className="mt-0.5 text-xs opacity-70">{r.desc}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Reviewer, Staff Admin, and System Admin accounts are created by administrators.
                </p>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 12 characters"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirm" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-3 text-sm text-destructive">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (!!confirmPassword && password !== confirmPassword)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

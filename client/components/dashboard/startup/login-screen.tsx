'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react'
import { login } from '@/lib/api'

export function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-accent/5 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 shadow-sm">
            <Image src="/logo.svg" alt="Innobiz-K" width={28} height={16} className="h-7 w-auto" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Innobiz-K</h1>
            <p className="text-sm text-muted-foreground">Startup Portal</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg shadow-black/5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">Sign in to your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">Build your profile, apply to programs, track your growth</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="ink-label">Email address</label>
              <input id="email" type="email" required autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="founder@startup.et" className="ink-input" />
            </div>

            <div>
              <label htmlFor="password" className="ink-label">Password</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" className="ink-input pr-10" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                <ShieldCheck size={15} className="mt-0.5 shrink-0" />{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><Loader2 size={16} className="animate-spin" />Signing in…</> : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Don't have an account?{' '}
            <a href="http://localhost:3000" className="font-medium text-primary hover:underline">Register on the platform</a>
          </p>
        </div>
      </div>
    </main>
  )
}

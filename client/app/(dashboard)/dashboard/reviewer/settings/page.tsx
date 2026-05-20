'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, AlertCircle, Eye, EyeOff, Loader2, User, Lock, Globe, Info } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { getSession } from '@/lib/session'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

const navItems = [
  { href: '/dashboard/reviewer', label: 'Dashboard' },
  { href: '/dashboard/reviewer/submissions', label: 'My Submissions' },
  { href: '/dashboard/reviewer/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/reviewer/conflicts', label: 'Conflicts' },
  { href: '/dashboard/reviewer/help', label: 'Help' },
  { href: '/dashboard/reviewer/settings', label: 'Settings' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const s = getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
  }, [router])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.tokens.accessToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok || !body?.success) throw new Error(body?.message || 'Failed to change password')
      setSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const initials = session?.user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <DashboardShell title="Settings" description="Manage your account and preferences" navItems={navItems} portalLabel="REVIEWER PORTAL">
      <div className="mx-auto max-w-3xl space-y-6 page-transition">

        {/* Account Info */}
        <section className="fade-in">
          <div className="mb-3 flex items-center gap-2">
            <User size={15} className="text-muted-foreground icon-hover" />
            <h2 className="text-sm font-semibold text-foreground">Account Information</h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-smooth border-glow">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary transition-all duration-300 hover:scale-110 hover:bg-primary/20">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{session?.user?.email}</p>
                <p className="text-xs text-muted-foreground">Role: {session?.user?.role?.replace('_', ' ')}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Active account</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3">
              {[
                ['Email', session?.user?.email ?? '—'],
                ['Role', session?.user?.role?.replace('_', ' ') ?? '—'],
                ['Status', 'Active'],
              ].map(([label, value], index) => (
                <div key={label} className={`stagger-item`} style={{animationDelay: `${index * 100}ms`}}>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Change Password */}
        <section className="slide-in-right">
          <div className="mb-3 flex items-center gap-2">
            <Lock size={15} className="text-muted-foreground icon-hover" />
            <h2 className="text-sm font-semibold text-foreground">Change Password</h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-smooth border-glow">
            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 scale-in">
                <Check size={15} className="shrink-0" />{success}
              </div>
            )}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive scale-in">
                <AlertCircle size={15} className="shrink-0" />{error}
                <button onClick={() => setError('')} className="ml-auto text-xs underline hover:text-destructive/80 transition-colors">Dismiss</button>
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="stagger-item">
                <label className="ink-label">Current Password</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} required value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} className="ink-input input-focus pr-10"
                    placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowCurrent(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all hover:scale-110" tabIndex={-1}>
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="stagger-item" style={{animationDelay: '100ms'}}>
                  <label className="ink-label">New Password</label>
                  <div className="relative">
                    <input type={showNew ? 'text' : 'password'} required value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} className="ink-input input-focus pr-10"
                      placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all hover:scale-110" tabIndex={-1}>
                      {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div className="stagger-item" style={{animationDelay: '150ms'}}>
                  <label className="ink-label">Confirm New Password</label>
                  <input type="password" required value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} className="ink-input input-focus"
                    placeholder="Repeat new password" />
                </div>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive fade-in">Passwords do not match</p>
              )}
              <button type="submit" disabled={saving || (!!newPassword && !!confirmPassword && newPassword !== confirmPassword)}
                className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 ripple">
                {saving ? <><Loader2 size={14} className="animate-spin" />Updating…</> : 'Update Password'}
              </button>
            </form>
          </div>
        </section>

        {/* API Config */}
        <section className="scale-in">
          <div className="mb-3 flex items-center gap-2">
            <Globe size={15} className="text-muted-foreground icon-hover" />
            <h2 className="text-sm font-semibold text-foreground">API Configuration</h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-smooth border-glow">
            <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4 transition-all duration-300 hover:bg-muted/70">
              <Info size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Backend URL</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground break-all">{API_BASE}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Set <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">NEXT_PUBLIC_API_BASE_URL</code> in your environment to override.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </DashboardShell>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, AlertCircle, X } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/session'
import { changePassword } from '@/lib/api'

const navItems = [
  { href: '/dashboard/investor', label: 'Dashboard' },
  { href: '/dashboard/investor/discover', label: 'Discover Startups' },
  { href: '/dashboard/investor/matches', label: 'My Matches' },
  { href: '/dashboard/investor/programs', label: 'Programs' },
  { href: '/dashboard/investor/profile', label: 'My Profile' },
  { href: '/dashboard/investor/settings', label: 'Settings' },
]

export default function SettingsPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await changePassword(currentPassword, newPassword)
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

  return (
    <DashboardShell title="Settings" description="Account settings and preferences" navItems={navItems} portalLabel="INVESTOR PORTAL">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Account Information</h2>
          <div className="space-y-3">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 text-sm font-medium">{session?.user?.email || '—'}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="mt-1 text-sm font-medium">Investor</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Change Password</h2>
          {success && <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700"><Check size={14} /> {success}</div>}
          {error && <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive"><AlertCircle size={14} /> {error}<button onClick={() => setError('')} className="ml-auto"><X size={12} /></button></div>}
          <form onSubmit={handleChangePassword} className="space-y-3">
            {[
              { label: 'Current Password', value: currentPassword, set: setCurrentPassword },
              { label: 'New Password', value: newPassword, set: setNewPassword },
              { label: 'Confirm New Password', value: confirmPassword, set: setConfirmPassword },
            ].map(({ label, value, set }) => (
              <label key={label} className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <input type="password" required value={value} onChange={e => set(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
              </label>
            ))}
            <Button type="submit" disabled={saving} className="w-full text-sm">{saving ? 'Updating...' : 'Update Password'}</Button>
          </form>
        </Card>
      </div>
    </DashboardShell>
  )
}

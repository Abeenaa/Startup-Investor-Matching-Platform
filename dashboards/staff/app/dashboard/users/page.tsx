'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { getUsers, type AdminUserItem } from '@/lib/api'
import { Search, RefreshCw, AlertCircle } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/programs', label: 'Programs' },
  { href: '/dashboard/applications', label: 'Applications' },
  { href: '/dashboard/users', label: 'Users' },
  { href: '/dashboard/settings', label: 'Settings' },
]

const ROLE_COLORS: Record<string, string> = {
  STARTUP: 'border-green-200 bg-green-50 text-green-700',
  INVESTOR: 'border-blue-200 bg-blue-50 text-blue-700',
  REVIEWER: 'border-purple-200 bg-purple-50 text-purple-700',
  STAFF_ADMIN: 'border-orange-200 bg-orange-50 text-orange-700',
  SYSTEM_ADMIN: 'border-red-200 bg-red-50 text-red-700',
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setUsers(await getUsers()) }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to load users') }
    finally { setLoading(false) }
  }

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <DashboardShell title="Users" description="Platform user accounts visible to staff admins" navItems={navItems} portalLabel="STAFF ADMIN">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} className="shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Role summary */}
      <div className="mb-5 flex flex-wrap gap-2">
        {Object.entries(roleCounts).map(([role, count]) => (
          <button key={role} onClick={() => setRoleFilter(roleFilter === role ? 'ALL' : role)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${roleFilter === role ? ROLE_COLORS[role] : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {role.replace('_', ' ')} <span className="font-bold">{count}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…"
            className="h-9 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <button onClick={load} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted">
          <RefreshCw size={14} />
        </button>
        <span className="text-xs text-muted-foreground">{filtered.length} users</span>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map(user => (
              <div key={user.id} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role] ?? 'border-border bg-muted text-muted-foreground'}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${user.isActive ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

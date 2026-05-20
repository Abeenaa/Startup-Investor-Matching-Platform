'use client'

import { useEffect, useState } from 'react'
import { Shield, UserCheck, UserX, Search, RefreshCw } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { getUsers, getDashboard, type AdminUserItem, type SystemDashboardData } from '@/lib/api'

const navItems = [
  { href: '/dashboard/system-admin', label: 'Dashboard' },
  { href: '/dashboard/system-admin/servers', label: 'Servers' },
  { href: '/dashboard/system-admin/database', label: 'Database' },
  { href: '/dashboard/system-admin/security', label: 'Security' },
  { href: '/dashboard/system-admin/settings', label: 'Settings' },
]

const ROLE_COLORS: Record<string, string> = {
  STARTUP: 'border-green-200 bg-green-50 text-green-700',
  INVESTOR: 'border-blue-200 bg-blue-50 text-blue-700',
  REVIEWER: 'border-purple-200 bg-purple-50 text-purple-700',
  STAFF_ADMIN: 'border-orange-200 bg-orange-50 text-orange-700',
  SYSTEM_ADMIN: 'border-red-200 bg-red-50 text-red-700',
}

export default function SecurityPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [systemData, setSystemData] = useState<SystemDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([getUsers(), getDashboard()])
      .then(([u, d]) => { setUsers(u); setSystemData(d) })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = users.filter(u => u.isActive).length
  const inactiveCount = users.filter(u => !u.isActive).length

  return (
    <DashboardShell title="Security" description="User account visibility and access control overview" navItems={navItems} portalLabel="SYSTEM ADMIN">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Accounts', value: users.length, icon: Shield, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Active', value: activeCount, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Inactive', value: inactiveCount, icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'New This Month', value: systemData?.growthMetrics?.newUsersThisMonth ?? 0, icon: RefreshCw, color: 'text-secondary', bg: 'bg-secondary/10' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* User list */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">All User Accounts</h2>
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users…" className="h-8 rounded-lg border border-input bg-background pl-8 pr-3 text-xs outline-none focus:border-primary" />
            </div>
          </div>
          <div className="divide-y divide-border">
            {loading ? (
              [...Array(5)].map((_, i: number) => <div key={i} className="skeleton mx-5 my-3 h-12 rounded-xl" />)
            ) : filtered.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted-foreground">No users found.</p>
            ) : filtered.map(user => (
              <div key={user.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
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
      </div>
    </DashboardShell>
  )
}

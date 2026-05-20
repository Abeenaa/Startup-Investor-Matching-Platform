'use client'

import { useEffect, useState } from 'react'
import { Activity, Database, Shield, Users } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDashboard, type SystemDashboardData } from '@/lib/api'

const navItems = [
  { href: '/dashboard/system-admin', label: 'Dashboard' },
  { href: '/dashboard/system-admin/servers', label: 'Servers' },
  { href: '/dashboard/system-admin/database', label: 'Database' },
  { href: '/dashboard/system-admin/security', label: 'Security' },
  { href: '/dashboard/system-admin/settings', label: 'Settings' },
]

export default function DashboardPage() {
  const [data, setData] = useState<SystemDashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard().then(setData).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
  }, [])

  return (
    <DashboardShell title="System Admin Dashboard" description="Users, health, and platform-wide oversight" navItems={navItems}>
      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div> : null}

      {!data ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading system dashboard...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Users" value={data.users.total} note={`${data.users.active} active accounts`} icon={Users} />
            <StatCard label="Applications" value={data.systemHealth.totalApplications} note={`${data.systemHealth.totalPrograms} total programs`} icon={Database} iconClassName="text-secondary" />
            <StatCard label="Evaluations" value={data.systemHealth.totalEvaluations} note={`${data.systemHealth.averageResponseTime} day avg response`} icon={Activity} iconClassName="text-accent" />
            <StatCard label="Pending Profiles" value={data.profiles.startups.pending + data.profiles.investors.pending} note="Startup and investor approvals" icon={Shield} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground">Recent Users</h2>
              <div className="mt-4 space-y-3">
                {data.recentUsers.map((user) => (
                  <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.email}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Created {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="border border-secondary/20 bg-secondary/10 text-secondary">{user.role.replaceAll('_', ' ')}</Badge>
                      <Badge className={user.isActive ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground">Role Distribution</h2>
              <div className="mt-4 space-y-3">
                {[
                  ['Startups', data.users.byRole.startup],
                  ['Investors', data.users.byRole.investor],
                  ['Reviewers', data.users.byRole.reviewer],
                  ['Staff Admins', data.users.byRole.staffAdmin],
                  ['System Admins', data.users.byRole.systemAdmin],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border border-border p-4">
                    <span className="text-sm text-foreground">{label}</span>
                    <span className="text-sm font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

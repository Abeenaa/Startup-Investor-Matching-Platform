'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, FileText, Zap, AlertCircle, Settings, Database } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDashboard, getUsers, logout } from '@/lib/api'
import { getSession } from '@/lib/session'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/users', label: 'Users' },
  { href: '/dashboard/programs', label: 'Programs' },
  { href: '/dashboard/applications', label: 'Applications' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [role, setRole] = useState<'STAFF_ADMIN' | 'SYSTEM_ADMIN'>('STAFF_ADMIN')
  const [error, setError] = useState('')

  useEffect(() => {
    const session = getSession()
    if (!session) { router.push('/login'); return }
    setRole(session.user.role as 'STAFF_ADMIN' | 'SYSTEM_ADMIN')

    getDashboard()
      .then((result: any) => {
        setData(result.staff || result.system || result)
        if (result.role) setRole(result.role)
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
  }, [router])

  const sectionTitle = role === 'SYSTEM_ADMIN' ? 'System Administration' : 'Platform Administration'
  const sectionDesc = role === 'SYSTEM_ADMIN' ? 'Users, health, and platform-wide oversight' : 'Programs, approvals, and operational workflows'

  return (
    <DashboardShell title={sectionTitle} description={sectionDesc} navItems={navItems}>
      {error && <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

      {!data ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading dashboard...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label={role === 'SYSTEM_ADMIN' ? 'Total Users' : 'Applications'}
              value={role === 'SYSTEM_ADMIN' ? (data.users?.total ?? 0) : (data.applications?.total ?? 0)}
              note={role === 'SYSTEM_ADMIN' ? `${data.users?.active ?? 0} active` : `${data.applications?.submitted ?? 0} submitted`}
              icon={Users}
            />
            <StatCard
              label="Applications"
              value={role === 'SYSTEM_ADMIN' ? (data.systemHealth?.totalApplications ?? 0) : (data.applications?.total ?? 0)}
              note={role === 'SYSTEM_ADMIN' ? `${data.systemHealth?.totalPrograms ?? 0} programs` : `${data.applications?.underReview ?? 0} under review`}
              icon={FileText}
              iconClassName="text-secondary"
            />
            <StatCard
              label="Active Programs"
              value={data.programs?.active ?? data.systemHealth?.totalPrograms ?? 0}
              note={`${data.programs?.averageApplicationsPerProgram ?? 0} avg apps`}
              icon={Zap}
              iconClassName="text-accent"
            />
            <StatCard
              label="Pending"
              value={(data.approvalQueue?.pendingStartups ?? 0) + (data.approvalQueue?.pendingInvestors ?? 0) + (data.approvalQueue?.pendingApplications ?? 0)}
              note="Awaiting attention"
              icon={AlertCircle}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Role Distribution (System Admin) */}
            {role === 'SYSTEM_ADMIN' && data.users?.byRole && (
              <Card className="p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Role Distribution</h2>
                <div className="space-y-3">
                  {[
                    ['Startups', data.users.byRole.startup],
                    ['Investors', data.users.byRole.investor],
                    ['Reviewers', data.users.byRole.reviewer],
                    ['Staff Admins', data.users.byRole.staffAdmin],
                    ['System Admins', data.users.byRole.systemAdmin],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-border p-3">
                      <span className="text-sm text-foreground">{label}</span>
                      <span className="text-sm font-semibold">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Recent Applications (Staff Admin) */}
            {role === 'STAFF_ADMIN' && data.recentApplications && (
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Recent Applications</h2>
                  <Link href="/dashboard/applications"><Button variant="outline" className="h-8 text-xs">View All</Button></Link>
                </div>
                <div className="space-y-3">
                  {data.recentApplications.slice(0, 5).map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between rounded-2xl border border-border p-3">
                      <div>
                        <p className="text-sm font-medium">{app.startupName}</p>
                        <p className="text-xs text-muted-foreground">{app.programName}</p>
                      </div>
                      <Badge className="border border-primary/20 bg-primary/10 text-primary text-xs">{app.status.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Approval Queue */}
            {data.approvalQueue && (
              <Card className="p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Approval Queue</h2>
                <div className="space-y-3">
                  {[
                    ['Startup profiles', data.approvalQueue.pendingStartups],
                    ['Investor profiles', data.approvalQueue.pendingInvestors],
                    ['Application decisions', data.approvalQueue.pendingApplications],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-border p-3">
                      <span className="text-sm text-foreground">{label}</span>
                      <span className={`text-sm font-semibold ${Number(value) > 0 ? 'text-orange-600' : 'text-foreground'}`}>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard/programs"><Button variant="outline" className="h-9 w-full gap-1 text-xs"><Zap size={12} /> Programs</Button></Link>
                <Link href="/dashboard/users"><Button variant="outline" className="h-9 w-full gap-1 text-xs"><Users size={12} /> Users</Button></Link>
                <Link href="/dashboard/applications"><Button variant="outline" className="h-9 w-full gap-1 text-xs"><FileText size={12} /> Applications</Button></Link>
                <Link href="/dashboard/reports"><Button variant="outline" className="h-9 w-full gap-1 text-xs"><Database size={12} /> Reports</Button></Link>
              </div>
            </Card>
          </div>

          {/* Recent Users (System Admin) */}
          {role === 'SYSTEM_ADMIN' && data.recentUsers?.length > 0 && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Recent Users</h2>
                <Link href="/dashboard/users"><Button variant="outline" className="h-8 text-xs">View All</Button></Link>
              </div>
              <div className="space-y-3">
                {data.recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between rounded-2xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Created {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="border border-secondary/20 bg-secondary/10 text-secondary text-xs">{user.role.replace('_', ' ')}</Badge>
                      <Badge className={user.isActive ? 'border border-green-200 bg-green-50 text-green-700 text-xs' : 'border border-red-200 bg-red-50 text-red-700 text-xs'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </DashboardShell>
  )
}

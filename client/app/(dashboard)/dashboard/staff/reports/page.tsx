'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { getSession } from '@/lib/session'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

const navItems = [
  { href: '/dashboard/staff', label: 'Dashboard' },
  { href: '/dashboard/staff/programs', label: 'Programs' },
  { href: '/dashboard/staff/applications', label: 'Applications' },
  { href: '/dashboard/staff/users', label: 'Users' },
  { href: '/dashboard/staff/reports', label: 'Reports' },
  { href: '/dashboard/staff/settings', label: 'Settings' },
]

const COLORS = ['#28C3BE', '#056EDC', '#FFC300', '#FF8700', '#009BAA']

async function apiFetch(path: string) {
  const session = getSession()
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  if (session?.tokens.accessToken) headers.set('Authorization', `Bearer ${session.tokens.accessToken}`)
  const res = await fetch(`${API_BASE}${path}`, { headers })
  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.success) throw new Error(body?.message || 'Request failed')
  return body.data
}

export default function ReportsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const session = getSession()
    if (!session) { router.push('/login'); return }
    apiFetch('/dashboard/staff-admin')
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load reports'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return (
    <DashboardShell title="Reports" description="Platform analytics and insights" navItems={navItems} portalLabel="STAFF ADMIN" allowedRoles={['STAFF_ADMIN']}>
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading reports...</div>
    </DashboardShell>
  )

  const roleDistribution = data?.users?.byRole ? [
    { name: 'Startups', value: data.users.byRole.startup },
    { name: 'Investors', value: data.users.byRole.investor },
    { name: 'Reviewers', value: data.users.byRole.reviewer },
    { name: 'Staff', value: data.users.byRole.staffAdmin },
    { name: 'System', value: data.users.byRole.systemAdmin },
  ] : []

  const appStatusData = data?.applications ? [
    { name: 'Submitted', value: data.applications.submitted },
    { name: 'Under Review', value: data.applications.underReview },
    { name: 'Approved', value: data.applications.approved },
    { name: 'Rejected', value: data.applications.rejected },
  ] : []

  const monthlyApps = data?.activityTrends?.applicationsPerMonth || []
  const monthlyUsers = data?.activityTrends?.usersPerMonth || []

  return (
    <DashboardShell title="Reports" description="Platform analytics and insights" navItems={navItems} portalLabel="STAFF ADMIN" allowedRoles={['STAFF_ADMIN']}>
      {error && <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Total Users', value: data?.users?.total ?? 0 },
          { label: 'Total Applications', value: data?.applications?.total ?? 0 },
          { label: 'Active Programs', value: data?.programs?.active ?? 0 },
          { label: 'Approval Rate', value: `${data?.applications?.approvalRate ?? 0}%` },
        ].map(item => (
          <Card key={item.label} className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Application Status Distribution */}
        {appStatusData.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Application Status Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={appStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {appStatusData.map((_, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Role Distribution */}
        {roleDistribution.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">User Role Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={roleDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#28C3BE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Monthly Applications Trend */}
        {monthlyApps.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Monthly Applications</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyApps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#056EDC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Monthly Users Trend */}
        {monthlyUsers.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Monthly User Registrations</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#FFC300" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Growth Metrics */}
      {data?.growthMetrics && (
        <Card className="mt-6 p-6">
          <h2 className="mb-4 text-sm font-semibold text-foreground">This Month's Growth</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'New Users', value: data.growthMetrics.newUsersThisMonth },
              { label: 'New Startups', value: data.growthMetrics.newStartupsThisMonth },
              { label: 'New Investors', value: data.growthMetrics.newInvestorsThisMonth },
              { label: 'New Applications', value: data.growthMetrics.newApplicationsThisMonth },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-border p-4 text-center">
                <p className="text-xl font-bold text-primary">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </DashboardShell>
  )
}

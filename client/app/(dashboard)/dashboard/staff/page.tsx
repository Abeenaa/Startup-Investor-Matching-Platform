'use client'

import { useEffect, useState } from 'react'
import { ClipboardCheck, FileText, Layers3, Users } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDashboard, type StaffDashboardData } from '@/lib/api'

const navItems = [
  { href: '/dashboard/staff', label: 'Dashboard' },
  { href: '/dashboard/staff/programs', label: 'Programs' },
  { href: '/dashboard/staff/applications', label: 'Applications' },
  { href: '/dashboard/staff/users', label: 'Users' },
  { href: '/dashboard/staff/reports', label: 'Reports' },
  { href: '/dashboard/staff/settings', label: 'Settings' },
]

export default function DashboardPage() {
  const [data, setData] = useState<StaffDashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard().then(setData).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
  }, [])

  return (
    <DashboardShell title="Staff Admin Dashboard" description="Programs, approvals, and operational workflows" navItems={navItems} portalLabel="STAFF ADMIN">
      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div> : null}

      {!data ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading staff dashboard...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Applications" value={data.applications.total} note={`${data.applications.submitted} submitted now`} icon={FileText} />
            <StatCard label="Approval Rate" value={`${data.applications.approvalRate}%`} note={`${data.applications.approved} approved so far`} icon={ClipboardCheck} iconClassName="text-secondary" />
            <StatCard label="Programs" value={data.programs.active} note={`${data.programs.closed} closed programs`} icon={Layers3} iconClassName="text-accent" />
            <StatCard label="Pending Profiles" value={data.approvalQueue.pendingStartups + data.approvalQueue.pendingInvestors} note={`${data.approvalQueue.pendingApplications} applications waiting`} icon={Users} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground">Recent Applications</h2>
              <p className="mt-1 text-xs text-muted-foreground">Live data from `/api/dashboard/staff-admin`</p>
              <div className="mt-4 space-y-3">
                {data.recentApplications.map((application: StaffDashboardData["recentApplications"][number]) => (
                  <div key={application.id} className="flex flex-col gap-3 rounded-2xl border border-border p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{application.startupName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{application.programName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="border border-primary/20 bg-primary/10 text-primary">{application.status.replaceAll('_', ' ')}</Badge>
                      <span className="text-xs text-muted-foreground">{application.evaluationCount} evaluations</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground">Approval Queue</h2>
              <div className="mt-4 space-y-3">
                {[
                  ['Startup profiles', data.approvalQueue.pendingStartups],
                  ['Investor profiles', data.approvalQueue.pendingInvestors],
                  ['Application decisions', data.approvalQueue.pendingApplications],
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

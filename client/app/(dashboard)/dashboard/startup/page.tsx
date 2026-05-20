'use client'

import { useEffect, useState } from 'react'
import { FileText, CheckCircle, Clock, AlertCircle, Rocket } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDashboard, type StartupDashboardData } from '@/lib/api'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard/startup', label: 'Dashboard' },
  { href: '/dashboard/startup/profile', label: 'My Profile' },
  { href: '/dashboard/startup/applications', label: 'My Applications' },
  { href: '/dashboard/startup/programs', label: 'Browse Programs' },
  { href: '/dashboard/startup/settings', label: 'Settings' },
]

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'border-slate-200 bg-slate-100 text-slate-600',
  SUBMITTED: 'border-blue-200 bg-blue-50 text-blue-700',
  UNDER_REVIEW: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  APPROVED: 'border-green-200 bg-green-50 text-green-700',
  REJECTED: 'border-red-200 bg-red-50 text-red-700',
}

export default function StartupDashboard() {
  const [data, setData] = useState<StartupDashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
  }, [])

  return (
    <DashboardShell title="Startup Dashboard" description="Manage your profile, applications, and growth" navItems={navItems} portalLabel="STARTUP PORTAL">
      {error && <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"><AlertCircle size={14} /> {error}</div>}

      {!data ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading dashboard...</div>
      ) : (
        <div className="space-y-6">
          {/* Profile Status */}
          {!data.profile ? (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Set up your startup profile</p>
                  <p className="mt-1 text-xs text-muted-foreground">Create your profile to apply to programs and get discovered by investors.</p>
                </div>
                <Link href="/dashboard/profile"><Button className="shrink-0 text-xs">Create Profile</Button></Link>
              </div>
            </div>
          ) : data.profile.approvalStatus === 'PENDING' ? (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-yellow-800">Profile under review</p>
              <p className="mt-1 text-xs text-yellow-700">Your startup profile is pending admin approval. You can still apply to programs.</p>
            </div>
          ) : data.profile.approvalStatus === 'APPROVED' ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <p className="text-sm font-semibold text-green-800">Profile approved — you're visible in the directory</p>
              </div>
            </div>
          ) : null}

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Applications" value={data.applications.total} note={`${data.applications.draft} drafts`} icon={FileText} />
            <StatCard label="Under Review" value={data.applications.underReview} note={`${data.applications.submitted} submitted`} icon={Clock} iconClassName="text-secondary" />
            <StatCard label="Approved" value={data.applications.approved} note="Successful applications" icon={CheckCircle} iconClassName="text-green-600" />
            <StatCard label="Available Programs" value={data.availablePrograms.length} note="Open for applications" icon={Rocket} iconClassName="text-accent" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            {/* Recent Applications */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Recent Applications</h2>
                <Link href="/dashboard/applications"><Button variant="outline" className="h-8 text-xs">View All</Button></Link>
              </div>
              {data.recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {data.recentApplications.map(app => (
                    <div key={app.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{app.programName}</p>
                        {app.submittedAt && <p className="mt-0.5 text-xs text-muted-foreground">Submitted {new Date(app.submittedAt).toLocaleDateString()}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {app.averageScore && <span className="text-xs text-muted-foreground">Score: {app.averageScore.toFixed(1)}</span>}
                        <Badge className={`border text-xs ${STATUS_COLORS[app.status] || 'border-border bg-muted text-muted-foreground'}`}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                  <Link href="/dashboard/programs"><Button className="mt-3 text-xs">Browse Programs</Button></Link>
                </div>
              )}
            </Card>

            {/* Quick Actions + Programs */}
            <div className="space-y-4">
              <Card className="p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h2>
                <div className="space-y-2">
                  <Link href="/dashboard/programs" className="block">
                    <Button variant="outline" className="w-full justify-start text-xs">🚀 Apply to a Program</Button>
                  </Link>
                  <Link href="/dashboard/profile" className="block">
                    <Button variant="outline" className="w-full justify-start text-xs">👤 Update Profile</Button>
                  </Link>
                  <Link href="/dashboard/applications" className="block">
                    <Button variant="outline" className="w-full justify-start text-xs">📋 View Applications</Button>
                  </Link>
                </div>
              </Card>

              {data.availablePrograms.length > 0 && (
                <Card className="p-6">
                  <h2 className="mb-3 text-xs font-semibold text-muted-foreground">OPEN PROGRAMS</h2>
                  <div className="space-y-2">
                    {data.availablePrograms.slice(0, 3).map(p => (
                      <div key={p.id} className="rounded-xl border border-border p-3">
                        <p className="text-xs font-medium text-foreground">{p.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{p.type} · Deadline {new Date(p.deadline).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/programs">
                    <Button variant="ghost" className="mt-3 w-full text-xs text-primary">View All Programs →</Button>
                  </Link>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Clock3, FileCheck, ArrowRight } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Badge } from '@/components/ui/badge'
import { getDashboard, type ReviewerDashboardData } from '@/lib/api'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/submissions', label: 'My Submissions' },
  { href: '/dashboard/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/conflicts', label: 'Conflicts' },
  { href: '/dashboard/help', label: 'Help' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function DashboardPage() {
  const [data, setData] = useState<ReviewerDashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
  }, [])

  return (
    <DashboardShell title="Reviewer Dashboard" description="Review and evaluate startup applications" navItems={navItems} portalLabel="REVIEWER PORTAL">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} className="shrink-0" /> {error}
        </div>
      )}

      {!data ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Pending Reviews" value={data.assignments.pending} note={`${data.assignments.total} total assigned`} icon={AlertCircle} iconClassName="text-orange-500" />
            <StatCard label="Completed" value={data.assignments.completed} note={`${data.workload.thisMonth} this month`} icon={CheckCircle} iconClassName="text-green-500" />
            <StatCard label="Avg. Score" value={`${data.evaluationStatistics.averageScore || 0}/10`} note={`${data.evaluationStatistics.totalEvaluations} evaluations`} icon={FileCheck} iconClassName="text-primary" />
            <StatCard label="This Week" value={data.workload.thisWeek} note={`${data.workload.averagePerWeek} avg/week`} icon={Clock3} iconClassName="text-secondary" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            {/* Pending queue */}
            <div className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Pending Assignments</h2>
                  <p className="text-xs text-muted-foreground">Applications waiting for your evaluation</p>
                </div>
                <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
                  {data.assignments.pending} open
                </span>
              </div>
              <div className="divide-y divide-border">
                {data.pendingApplications.length ? data.pendingApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{app.startupName}</p>
                      <p className="text-xs text-muted-foreground">{app.programName} · {app.sector}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {app.daysWaiting}d waiting
                      </span>
                      <Link href="/dashboard/submissions"
                        className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted">
                        Evaluate <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                )) : (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">No pending assignments right now. 🎉</p>
                )}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Recent evaluations */}
              <div className="rounded-2xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="text-sm font-semibold text-foreground">Recent Evaluations</h2>
                </div>
                <div className="divide-y divide-border">
                  {data.recentEvaluations.length ? data.recentEvaluations.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{item.startupName}</p>
                        <p className="truncate text-xs text-muted-foreground">{item.programName}</p>
                      </div>
                      <div className="ml-3 shrink-0 text-right">
                        <p className="text-sm font-bold text-foreground">{item.score}/10</p>
                        <p className="text-[10px] text-muted-foreground">{item.recommendation.replace('_', ' ')}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="px-5 py-6 text-center text-xs text-muted-foreground">No evaluations yet</p>
                  )}
                </div>
              </div>

              {/* Quick actions */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { label: 'View all submissions', href: '/dashboard/submissions' },
                    { label: 'Scoring guide', href: '/dashboard/scoring' },
                    { label: 'Conflict policy', href: '/dashboard/conflicts' },
                  ].map(({ label, href }) => (
                    <Link key={href} href={href}
                      className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted">
                      {label} <ArrowRight size={13} className="text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation breakdown */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-foreground">Recommendation Breakdown</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Approve', value: data.evaluationStatistics.recommendations.approve, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                { label: 'Needs Improvement', value: data.evaluationStatistics.recommendations.needsImprovement, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
                { label: 'Reject', value: data.evaluationStatistics.recommendations.reject, color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`rounded-xl border p-4 text-center ${bg}`}>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

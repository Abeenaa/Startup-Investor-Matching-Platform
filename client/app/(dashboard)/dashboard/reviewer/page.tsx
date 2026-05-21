'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Clock3, FileCheck, ArrowRight } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Badge } from '@/components/ui/badge'
import { getDashboard, type ReviewerDashboardData } from '@/lib/api'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard/reviewer', label: 'Dashboard' },
  { href: '/dashboard/reviewer/submissions', label: 'My Submissions' },
  { href: '/dashboard/reviewer/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/reviewer/conflicts', label: 'Conflicts' },
  { href: '/dashboard/reviewer/help', label: 'Help' },
  { href: '/dashboard/reviewer/settings', label: 'Settings' },
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
             {[...Array(4)].map((_, i: number) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
           </div>
           <div className="skeleton h-64 rounded-2xl" />
         </div>
       ) : (
         <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-6 page-transition">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="stat-card border-l-4 border-l-[#28C3BE] stagger-item">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Applications Reviewed</p>
                  <p className="mt-2 text-3xl font-bold text-foreground transition-all duration-300 hover:scale-105">{data.assignments.completed}</p>
                </div>
                <CheckCircle className="text-[#28C3BE] icon-hover" size={20} />
              </div>
            </div>

            <div className="stat-card border-l-4 border-l-[#056EDC] stagger-item">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Pending Reviews</p>
                  <p className="mt-2 text-3xl font-bold text-foreground transition-all duration-300 hover:scale-105">{data.assignments.pending}</p>
                </div>
                <Clock3 className="text-[#056EDC] icon-hover" size={20} />
              </div>
            </div>

            <div className="stat-card border-l-4 border-l-[#FFC300] stagger-item">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Conflicts of Interest</p>
                  <p className="mt-2 text-3xl font-bold text-foreground transition-all duration-300 hover:scale-105">2</p>
                </div>
                <AlertCircle className="text-[#FFC300] icon-hover" size={20} />
              </div>
            </div>

            <div className="stat-card border-l-4 border-l-[#28C3BE] stagger-item">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Completed This Month</p>
                  <p className="mt-2 text-3xl font-bold text-foreground transition-all duration-300 hover:scale-105">{data.workload.thisMonth}</p>
                </div>
                <FileCheck className="text-[#28C3BE] icon-hover" size={20} />
              </div>
            </div>
          </div>

          {/* Evaluation Queue */}
          <div className="rounded-xl border border-border bg-white shadow-smooth fade-in">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">Evaluation Queue</h2>
                <p className="text-xs text-muted-foreground">Applications awaiting your review</p>
              </div>
              <span className="rounded-full bg-[#28C3BE]/10 px-3 py-1 text-sm font-semibold text-[#28C3BE] badge-animate">
                {data.assignments.pending} Pending
              </span>
            </div>
            
            <div className="divide-y divide-border custom-scrollbar max-h-[500px] overflow-y-auto">
              {data.pendingApplications.length ? data.pendingApplications.map((app: ReviewerDashboardData['pendingApplications'][number], index: number) => (
                <div key={app.id} className={`flex items-center justify-between px-6 py-4 table-row-hover cursor-pointer stagger-item`} style={{animationDelay: `${index * 50}ms`}}>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground transition-colors hover:text-primary">{app.startupName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{app.programName} · Submitted: {new Date(app.submittedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground transition-all hover:text-foreground">{app.daysWaiting}d</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 badge-animate">
                      Pending
                    </Badge>
                  </div>
                </div>
              )) : (
                <p className="px-6 py-12 text-center text-sm text-muted-foreground fade-in">No pending assignments right now. 🎉</p>
              )}
            </div>
          </div>

          {/* Recent Evaluations */}
          {data.recentEvaluations.length > 0 && (
            <div className="rounded-xl border border-border bg-white shadow-smooth slide-in-right">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-base font-semibold text-foreground">Recent Evaluations</h2>
              </div>
              <div className="divide-y divide-border custom-scrollbar max-h-[400px] overflow-y-auto">
                {data.recentEvaluations.slice(0, 5).map((item: ReviewerDashboardData['recentEvaluations'][number], index: number) => (
                  <div key={item.id} className={`flex items-center justify-between px-6 py-4 table-row-hover cursor-pointer stagger-item`} style={{animationDelay: `${index * 50}ms`}}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground transition-colors hover:text-primary">{item.startupName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.programName} · Submitted: {new Date(item.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-foreground transition-all hover:scale-110">{item.score}/10</span>
                      <Badge 
                        variant="outline" 
                        className={`badge-animate ${
                          item.recommendation === 'APPROVE' 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : item.recommendation === 'NEEDS_IMPROVEMENT'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {item.recommendation === 'APPROVE' ? 'Completed' : item.recommendation === 'NEEDS_IMPROVEMENT' ? 'In Progress' : 'Completed'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-smooth scale-in">
            <h2 className="mb-4 text-base font-semibold text-foreground">Quick Actions</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Link href="/dashboard/reviewer/submissions"
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-muted hover:border-primary hover:shadow-md hover:-translate-y-0.5 ripple">
                View All Submissions <ArrowRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/dashboard/reviewer/scoring"
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-muted hover:border-primary hover:shadow-md hover:-translate-y-0.5 ripple">
                Scoring Guide <ArrowRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/dashboard/reviewer/conflicts"
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:bg-muted hover:border-primary hover:shadow-md hover:-translate-y-0.5 ripple">
                Conflict Policy <ArrowRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

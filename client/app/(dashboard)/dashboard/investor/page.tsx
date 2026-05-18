'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Building2, Layers3, Star, AlertCircle } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDashboard, type InvestorDashboardData } from '@/lib/api'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard/investor', label: 'Dashboard' },
  { href: '/dashboard/investor/discover', label: 'Discover Startups' },
  { href: '/dashboard/investor/matches', label: 'My Matches' },
  { href: '/dashboard/investor/programs', label: 'Programs' },
  { href: '/dashboard/investor/profile', label: 'My Profile' },
  { href: '/dashboard/investor/settings', label: 'Settings' },
]

export default function InvestorDashboard() {
  const [data, setData] = useState<InvestorDashboardData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
  }, [])

  return (
    <DashboardShell title="Investor Dashboard" description="Discover startups and manage your investment pipeline" navItems={navItems} portalLabel="INVESTOR PORTAL">
      {error && <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"><AlertCircle size={14} /> {error}</div>}

      {!data ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading dashboard...</div>
      ) : (
        <div className="space-y-6">
          {/* Profile Status Banner */}
          {!data.profile && (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">Complete your investor profile</p>
                  <p className="mt-1 text-xs text-muted-foreground">Set up your profile to get matched with relevant startups and access all features.</p>
                </div>
                <Link href="/dashboard/profile">
                  <Button className="shrink-0 text-xs">Set Up Profile</Button>
                </Link>
              </div>
            </div>
          )}

          {data.profile && data.profile.approvalStatus !== 'APPROVED' && (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm font-semibold text-yellow-800">Profile under review</p>
              <p className="mt-1 text-xs text-yellow-700">Your investor profile is pending admin approval. You can still browse the directory.</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Startup Matches" value={data.matches.recent.length} note={`Best score: ${data.matches.highScore || data.matches.recent[0]?.score || 0}%`} icon={Star} iconClassName="text-accent" />
            <StatCard label="Startups in Directory" value={data.directory.totalStartups} note="Verified & approved" icon={Building2} iconClassName="text-secondary" />
            <StatCard label="Active Programs" value={data.programs.active} note="Open for applications" icon={Layers3} iconClassName="text-primary" />
            <StatCard label="Profile Status" value={data.profile ? data.profile.approvalStatus : 'Not Set'} note={data.profile ? data.profile.organizationName : 'Create your profile'} icon={TrendingUp} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            {/* Top Matches */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Top Startup Matches</h2>
                  <p className="text-xs text-muted-foreground">Based on your investment profile</p>
                </div>
                <Link href="/dashboard/matches">
                  <Button variant="outline" className="h-8 text-xs">View All</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {data.matches.recent.length > 0 ? data.matches.recent.map(match => (
                  <div key={match.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{match.startupName}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{match.sector} • {match.stage.replace('_', ' ')}</p>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{match.explanation}</p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-1">
                      <span className="text-lg font-bold text-primary">{match.score}%</span>
                      <Link href={`/dashboard/discover/${match.startupId}`}>
                        <Button variant="outline" className="h-7 text-xs">View</Button>
                      </Link>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                    <p className="text-sm text-muted-foreground">Complete your profile to see personalized matches</p>
                    <Link href="/dashboard/profile"><Button className="mt-3 text-xs">Set Up Profile</Button></Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/dashboard/discover" className="block">
                  <Button variant="outline" className="w-full justify-start text-xs">🔍 Browse Startup Directory</Button>
                </Link>
                <Link href="/dashboard/matches" className="block">
                  <Button variant="outline" className="w-full justify-start text-xs">⭐ View My Matches</Button>
                </Link>
                <Link href="/dashboard/programs" className="block">
                  <Button variant="outline" className="w-full justify-start text-xs">📋 Explore Programs</Button>
                </Link>
                <Link href="/dashboard/profile" className="block">
                  <Button variant="outline" className="w-full justify-start text-xs">👤 Update Profile</Button>
                </Link>
              </div>

              {/* Recent Programs */}
              {data.programs.list.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-semibold text-muted-foreground">OPEN PROGRAMS</h3>
                  <div className="space-y-2">
                    {data.programs.list.slice(0, 3).map(p => (
                      <div key={p.id} className="rounded-xl border border-border p-3">
                        <p className="text-xs font-medium text-foreground">{p.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{p.type} • Deadline {new Date(p.deadline).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Recent Startups */}
          {data.directory.recentStartups.length > 0 && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Recently Added Startups</h2>
                <Link href="/dashboard/discover"><Button variant="outline" className="h-8 text-xs">Browse All</Button></Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {data.directory.recentStartups.map(s => (
                  <Link key={s.id} href={`/dashboard/discover/${s.id}`}>
                    <div className="rounded-2xl border border-border p-4 transition hover:border-primary/30 hover:bg-primary/5">
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge className="border border-primary/20 bg-primary/10 text-primary">{s.sector}</Badge>
                        <Badge className="border border-border bg-muted text-muted-foreground">{s.stage?.replace('_', ' ')}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </DashboardShell>
  )
}

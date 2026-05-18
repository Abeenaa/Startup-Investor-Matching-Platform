'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Globe, Users, Building2 } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStartupById } from '@/lib/api'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/discover', label: 'Discover Startups' },
  { href: '/dashboard/matches', label: 'My Matches' },
  { href: '/dashboard/programs', label: 'Programs' },
  { href: '/dashboard/profile', label: 'My Profile' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function StartupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!params.id) return
    getStartupById(params.id as string)
      .then(setStartup)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load startup'))
      .finally(() => setLoading(false))
  }, [params.id])

  return (
    <DashboardShell title="Startup Profile" description="Detailed startup information" navItems={navItems}>
      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-xs text-muted-foreground">
          <ArrowLeft size={14} /> Back to Directory
        </Button>
      </div>

      {error && <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-muted" />)}
        </div>
      ) : startup ? (
        <div className="space-y-4">
          {/* Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">{startup.name}</h1>
                {startup.tagline && <p className="mt-1 text-sm text-muted-foreground">{startup.tagline}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="border border-primary/20 bg-primary/10 text-primary">{startup.sector}</Badge>
                  <Badge className="border border-border bg-muted text-muted-foreground">{startup.stage?.replace('_', ' ')}</Badge>
                  {startup.region && <Badge className="border border-border bg-muted text-muted-foreground">{startup.region}</Badge>}
                  <Badge className={startup.approvalStatus === 'APPROVED' ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-border bg-muted text-muted-foreground'}>
                    {startup.approvalStatus}
                  </Badge>
                </div>
              </div>
              {startup.website && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2 text-xs"><Globe size={12} /> Website</Button>
                </a>
              )}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* About */}
            <Card className="p-6">
              <h2 className="mb-3 text-sm font-semibold text-foreground">About</h2>
              <p className="text-sm leading-6 text-muted-foreground">{startup.description}</p>
            </Card>

            {/* Details */}
            <Card className="p-6">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Details</h2>
              <div className="space-y-3">
                {startup.teamSize && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Team Size:</span>
                    <span className="font-medium">{startup.teamSize}</span>
                  </div>
                )}
                {startup.region && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Region:</span>
                    <span className="font-medium">{startup.region}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Problem & Solution */}
            {startup.problemSolved && (
              <Card className="p-6">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Problem Solved</h2>
                <p className="text-sm leading-6 text-muted-foreground">{startup.problemSolved}</p>
              </Card>
            )}

            {startup.targetMarket && (
              <Card className="p-6">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Target Market</h2>
                <p className="text-sm leading-6 text-muted-foreground">{startup.targetMarket}</p>
              </Card>
            )}

            {startup.innovation && (
              <Card className="p-6 md:col-span-2">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Innovation</h2>
                <p className="text-sm leading-6 text-muted-foreground">{startup.innovation}</p>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center text-sm text-muted-foreground">Startup not found.</Card>
      )}
    </DashboardShell>
  )
}

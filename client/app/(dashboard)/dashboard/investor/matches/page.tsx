'use client'

import { useEffect, useState } from 'react'
import { Star, AlertCircle } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMatches } from '@/lib/api'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard/investor', label: 'Dashboard' },
  { href: '/dashboard/investor/discover', label: 'Discover Startups' },
  { href: '/dashboard/investor/matches', label: 'My Matches' },
  { href: '/dashboard/investor/programs', label: 'Programs' },
  { href: '/dashboard/investor/profile', label: 'My Profile' },
  { href: '/dashboard/investor/settings', label: 'Settings' },
]

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load matches'))
      .finally(() => setLoading(false))
  }, [])

  const scoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-primary'
    return 'text-muted-foreground'
  }

  return (
    <DashboardShell title="My Matches" description="AI-powered startup recommendations based on your profile" navItems={navItems}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-muted" />)}
        </div>
      ) : matches.length === 0 ? (
        <Card className="p-12 text-center">
          <Star size={32} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No matches yet</p>
          <p className="mt-2 text-xs text-muted-foreground">Complete your investor profile to get personalized startup recommendations.</p>
          <Link href="/dashboard/profile">
            <Button className="mt-4 text-xs">Set Up Profile</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {matches.map((match, i) => (
            <Card key={match.id || i} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{match.startupName}</h3>
                    <Badge className="border border-primary/20 bg-primary/10 text-primary">{match.sector}</Badge>
                    <Badge className="border border-border bg-muted text-muted-foreground">{match.stage?.replace('_', ' ')}</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{match.explanation}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-2xl font-bold ${scoreColor(match.score)}`}>{match.score}%</span>
                  <span className="text-xs text-muted-foreground">match score</span>
                  <Link href={`/dashboard/discover/${match.startupId}`}>
                    <Button variant="outline" className="h-8 text-xs">View Profile</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

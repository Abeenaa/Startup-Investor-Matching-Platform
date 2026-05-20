'use client'

import { useEffect, useState } from 'react'
import { Calendar, Layers3 } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPrograms } from '@/lib/api'

const navItems = [
  { href: '/dashboard/investor', label: 'Dashboard' },
  { href: '/dashboard/investor/discover', label: 'Discover Startups' },
  { href: '/dashboard/investor/matches', label: 'My Matches' },
  { href: '/dashboard/investor/programs', label: 'Programs' },
  { href: '/dashboard/investor/profile', label: 'My Profile' },
  { href: '/dashboard/investor/settings', label: 'Settings' },
]

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load programs'))
      .finally(() => setLoading(false))
  }, [])

  const isExpired = (deadline: string) => new Date(deadline) < new Date()

  return (
    <DashboardShell title="Programs" description="Active funding and support programs in the ecosystem" navItems={navItems}>
      {error && <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-muted" />)}
        </div>
      ) : programs.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No active programs at the moment.</Card>
      ) : (
        <div className="space-y-3">
          {programs.map(p => (
            <Card key={p.id} className="p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Layers3 size={14} className="text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                    <Badge className={isExpired(p.deadline) ? 'border border-slate-200 bg-slate-100 text-slate-600' : 'border border-green-200 bg-green-50 text-green-700'}>
                      {isExpired(p.deadline) ? 'Closed' : 'Open'}
                    </Badge>
                    <Badge className="border border-secondary/20 bg-secondary/10 text-secondary">{p.type}</Badge>
                  </div>
                  {p.description && <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-2">{p.description}</p>}
                  {p.eligibility && <p className="mt-1 text-xs text-muted-foreground">Eligibility: {p.eligibility}</p>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

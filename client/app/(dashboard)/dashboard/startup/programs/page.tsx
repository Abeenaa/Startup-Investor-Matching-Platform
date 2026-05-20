'use client'

import { useEffect, useState } from 'react'
import { Calendar, Layers3, Plus, AlertCircle, X, Check } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPrograms, createApplication } from '@/lib/api'

const navItems = [
  { href: '/dashboard/startup', label: 'Dashboard' },
  { href: '/dashboard/startup/profile', label: 'My Profile' },
  { href: '/dashboard/startup/applications', label: 'My Applications' },
  { href: '/dashboard/startup/programs', label: 'Browse Programs' },
  { href: '/dashboard/startup/settings', label: 'Settings' },
]

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applying, setApplying] = useState<string | null>(null)
  const [applied, setApplied] = useState<Set<string>>(new Set())

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load programs'))
      .finally(() => setLoading(false))
  }, [])

  async function handleApply(programId: string) {
    setApplying(programId)
    setError('')
    try {
      await createApplication(programId)
      setApplied(prev => new Set([...prev, programId]))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply')
    } finally {
      setApplying(null)
    }
  }

  const isExpired = (deadline: string) => new Date(deadline) < new Date()

  return (
    <DashboardShell title="Browse Programs" description="Discover and apply to funding and support programs" navItems={navItems}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl border border-border bg-muted" />)}
        </div>
      ) : programs.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No active programs at the moment. Check back soon.</Card>
      ) : (
        <div className="space-y-3">
          {programs.map(p => {
            const expired = isExpired(p.deadline)
            const hasApplied = applied.has(p.id)
            return (
              <Card key={p.id} className="p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Layers3 size={14} className="text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                      <Badge className={expired ? 'border border-slate-200 bg-slate-100 text-slate-600' : 'border border-green-200 bg-green-50 text-green-700'}>
                        {expired ? 'Closed' : 'Open'}
                      </Badge>
                      <Badge className="border border-secondary/20 bg-secondary/10 text-secondary">{p.type}</Badge>
                    </div>
                    {p.description && <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.description}</p>}
                    {p.eligibility && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium">Eligibility:</span> {p.eligibility}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>Deadline: {new Date(p.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {hasApplied ? (
                      <Button disabled className="h-9 gap-1 text-xs bg-green-600">
                        <Check size={12} /> Applied
                      </Button>
                    ) : (
                      <Button onClick={() => handleApply(p.id)} disabled={expired || applying === p.id}
                        className="h-9 gap-1 text-xs">
                        <Plus size={12} /> {applying === p.id ? 'Applying...' : 'Apply Now'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}

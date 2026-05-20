'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, ExternalLink, X } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStartupDirectory } from '@/lib/api'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard/investor', label: 'Dashboard' },
  { href: '/dashboard/investor/discover', label: 'Discover Startups' },
  { href: '/dashboard/investor/matches', label: 'My Matches' },
  { href: '/dashboard/investor/programs', label: 'Programs' },
  { href: '/dashboard/investor/profile', label: 'My Profile' },
  { href: '/dashboard/investor/settings', label: 'Settings' },
]

const SECTORS = ['FinTech', 'HealthTech', 'AgriTech', 'EdTech', 'E-Commerce', 'Logistics', 'CleanTech', 'SaaS']
const STAGES = ['IDEA', 'EARLY_STAGE', 'SEED', 'GROWTH', 'EXPANSION']

type Startup = {
  id: string
  name: string
  sector: string
  stage: string
  description: string
  teamSize?: number
  website?: string
  region?: string
  tagline?: string
}

export default function DiscoverPage() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [stage, setStage] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    load()
  }, [search, sector, stage, page])

  async function load() {
    setLoading(true)
    try {
      const result = await getStartupDirectory({ search, sector, stage, page })
      setStartups(result.data || [])
      setTotal(result.pagination?.total || 0)
      setTotalPages(result.pagination?.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load startups')
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setSearch('')
    setSector('')
    setStage('')
    setPage(1)
  }

  const hasFilters = search || sector || stage

  return (
    <DashboardShell title="Discover Startups" description="Browse verified startups in the Innobiz-K ecosystem" navItems={navItems}>
      {error && <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name or description..."
            className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={sector} onChange={e => { setSector(e.target.value); setPage(1) }}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="">All Sectors</option>
          {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={stage} onChange={e => { setStage(e.target.value); setPage(1) }}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters} className="h-10 gap-1 text-xs text-muted-foreground">
            <X size={12} /> Clear
          </Button>
        )}
        <span className="shrink-0 text-xs text-muted-foreground">{total} startups</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i: number) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl border border-border bg-muted" />
          ))}
        </div>
      ) : startups.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No startups found matching your criteria.</p>
          {hasFilters && <Button variant="outline" onClick={clearFilters} className="mt-4 text-xs">Clear Filters</Button>}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {startups.map(s => (
            <Link key={s.id} href={`/dashboard/discover/${s.id}`}>
              <Card className="h-full cursor-pointer p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{s.name}</h3>
                    {s.tagline && <p className="mt-0.5 text-xs text-muted-foreground">{s.tagline}</p>}
                  </div>
                  <ExternalLink size={14} className="shrink-0 text-muted-foreground" />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge className="border border-primary/20 bg-primary/10 text-primary">{s.sector}</Badge>
                  <Badge className="border border-border bg-muted text-muted-foreground">{s.stage?.replace('_', ' ')}</Badge>
                  {s.region && <Badge className="border border-border bg-muted text-muted-foreground">{s.region}</Badge>}
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground line-clamp-3">{s.description}</p>
                {s.teamSize && (
                  <p className="mt-3 text-xs text-muted-foreground">Team: {s.teamSize} people</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-9 text-xs">Previous</Button>
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-9 text-xs">Next</Button>
        </div>
      )}
    </DashboardShell>
  )
}

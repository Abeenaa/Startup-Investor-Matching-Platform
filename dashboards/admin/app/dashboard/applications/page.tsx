'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, X, Search, ChevronDown, Check } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/session'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:5000/api'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/users', label: 'Users' },
  { href: '/dashboard/programs', label: 'Programs' },
  { href: '/dashboard/applications', label: 'Applications' },
  { href: '/dashboard/reports', label: 'Reports' },
  { href: '/dashboard/settings', label: 'Settings' },
]

type Application = {
  id: string
  status: string
  submittedAt?: string
  createdAt: string
  program: { id: string; name: string; type: string; deadline: string }
  startup: { id: string; name: string; sector: string; stage: string }
  evaluationCount?: number
  averageScore?: number
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'border-slate-200 bg-slate-100 text-slate-600',
  SUBMITTED: 'border-blue-200 bg-blue-50 text-blue-700',
  UNDER_REVIEW: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  APPROVED: 'border-green-200 bg-green-50 text-green-700',
  REJECTED: 'border-red-200 bg-red-50 text-red-700',
}

async function apiFetch(path: string, init?: RequestInit) {
  const session = getSession()
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  if (session?.tokens.accessToken) headers.set('Authorization', `Bearer ${session.tokens.accessToken}`)
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers })
  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.success) throw new Error(body?.message || 'Request failed')
  return body.data
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.push('/login'); return }
    loadApplications()
  }, [router])

  async function loadApplications() {
    setLoading(true)
    try {
      const data = await apiFetch('/applications?page=1&limit=100')
      setApplications(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id: string) {
    setActionLoading(id)
    try {
      await apiFetch(`/applications/${id}/approve`, { method: 'PATCH' })
      await loadApplications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: string) {
    const reason = prompt('Rejection reason (optional):')
    setActionLoading(id)
    try {
      await apiFetch(`/applications/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason: reason || '' }) })
      await loadApplications()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = applications.filter(a => {
    const matchSearch = a.startup.name.toLowerCase().includes(search.toLowerCase()) || a.program.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <DashboardShell title="Applications" description="Review and manage all startup applications" navItems={navItems}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search startup or program..." className="h-9 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="ALL">All Statuses</option>
          {['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <p className="text-xs text-muted-foreground ml-auto">{filtered.length} results</p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading applications...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No applications found.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <Card key={a.id} className="overflow-hidden">
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{a.startup.name}</p>
                    <Badge className={`border text-xs ${STATUS_COLORS[a.status] || 'border-border bg-muted text-muted-foreground'}`}>{a.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{a.program.name} • {a.startup.sector} • {a.startup.stage}</p>
                  {a.submittedAt && <p className="mt-1 text-xs text-muted-foreground">Submitted {new Date(a.submittedAt).toLocaleDateString()}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {a.evaluationCount !== undefined && (
                    <span className="text-xs text-muted-foreground">{a.evaluationCount} eval{a.evaluationCount !== 1 ? 's' : ''}{a.averageScore ? ` · avg ${a.averageScore.toFixed(1)}` : ''}</span>
                  )}
                  {(a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW') && (
                    <>
                      <Button onClick={() => handleApprove(a.id)} disabled={actionLoading === a.id} className="h-8 gap-1 text-xs bg-green-600 hover:bg-green-700">
                        <Check size={12} /> Approve
                      </Button>
                      <Button variant="outline" onClick={() => handleReject(a.id)} disabled={actionLoading === a.id} className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/5">
                        <X size={12} /> Reject
                      </Button>
                    </>
                  )}
                  <button onClick={() => setExpandedId(expandedId === a.id ? null : a.id)} className="rounded-lg p-1 hover:bg-muted">
                    <ChevronDown size={14} className={`transition-transform ${expandedId === a.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {expandedId === a.id && (
                <div className="border-t border-border bg-muted/30 px-4 py-3">
                  <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                    <div><span className="text-muted-foreground">Program Type</span><p className="font-medium">{a.program.type}</p></div>
                    <div><span className="text-muted-foreground">Deadline</span><p className="font-medium">{new Date(a.program.deadline).toLocaleDateString()}</p></div>
                    <div><span className="text-muted-foreground">Stage</span><p className="font-medium">{a.startup.stage}</p></div>
                    <div><span className="text-muted-foreground">Application ID</span><p className="font-medium font-mono">{a.id.slice(0, 8)}...</p></div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

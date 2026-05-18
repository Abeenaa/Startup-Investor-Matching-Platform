'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { getApplications, approveApplication, rejectApplication, type AdminApplicationItem } from '@/lib/api'
import { Check, X, ChevronDown, ChevronUp, Search, AlertCircle, Loader2 } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/programs', label: 'Programs' },
  { href: '/dashboard/applications', label: 'Applications' },
  { href: '/dashboard/users', label: 'Users' },
  { href: '/dashboard/settings', label: 'Settings' },
]

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'border-slate-200 bg-slate-100 text-slate-600',
  SUBMITTED: 'border-blue-200 bg-blue-50 text-blue-700',
  UNDER_REVIEW: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  APPROVED: 'border-green-200 bg-green-50 text-green-700',
  REJECTED: 'border-red-200 bg-red-50 text-red-700',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplicationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getApplications()
      setApplications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id: string) {
    setActionLoading(id)
    try {
      await approveApplication(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: string) {
    const reason = prompt('Rejection reason (optional):') ?? ''
    setActionLoading(id)
    try {
      await rejectApplication(id, reason)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = applications.filter(a => {
    const matchSearch = a.startup.name.toLowerCase().includes(search.toLowerCase()) ||
      a.program.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <DashboardShell title="Applications" description="Review and manage all startup program applications" navItems={navItems} portalLabel="STAFF ADMIN">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} className="shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search startup or program…"
            className="h-9 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-primary" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary">
          <option value="ALL">All Statuses</option>
          {['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(a => (
            <div key={a.id} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{a.startup.name}</p>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[a.status] ?? 'border-border bg-muted text-muted-foreground'}`}>
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.program.name} · {a.startup.sector} · {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : 'Draft'}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  {(a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW') && (
                    <>
                      <button onClick={() => handleApprove(a.id)} disabled={actionLoading === a.id}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50">
                        {actionLoading === a.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Approve
                      </button>
                      <button onClick={() => handleReject(a.id)} disabled={actionLoading === a.id}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50">
                        <X size={12} /> Reject
                      </button>
                    </>
                  )}
                  <button onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted">
                    {expandedId === a.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>
              {expandedId === a.id && (
                <div className="border-t border-border bg-muted/30 px-5 py-4">
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    {[
                      ['Program Type', a.program.type],
                      ['Startup Stage', a.startup.stage.replace('_', ' ')],
                      ['Deadline', new Date(a.program.deadline).toLocaleDateString()],
                      ['Application ID', a.id.slice(0, 8) + '…'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-muted-foreground">{label}</p>
                        <p className="mt-0.5 font-medium text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

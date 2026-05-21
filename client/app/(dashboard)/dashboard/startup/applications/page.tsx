'use client'

import { useEffect, useState } from 'react'
import { Trash2, Send, AlertCircle, X, ChevronDown } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMyApplications, submitApplication, deleteApplication } from '@/lib/api'

const navItems = [
  { href: '/dashboard/startup', label: 'Dashboard' },
  { href: '/dashboard/startup/profile', label: 'My Profile' },
  { href: '/dashboard/startup/applications', label: 'My Applications' },
  { href: '/dashboard/startup/programs', label: 'Browse Programs' },
  { href: '/dashboard/startup/settings', label: 'Settings' },
]

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'border-slate-200 bg-slate-100 text-slate-600',
  SUBMITTED: 'border-blue-200 bg-blue-50 text-blue-700',
  UNDER_REVIEW: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  APPROVED: 'border-green-200 bg-green-50 text-green-700',
  REJECTED: 'border-red-200 bg-red-50 text-red-700',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await getMyApplications()
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(id: string) {
    if (!confirm('Submit this application? You cannot edit it after submission.')) return
    setActionLoading(id)
    try {
      await submitApplication(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this draft application?')) return
    setActionLoading(id)
    try {
      await deleteApplication(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <DashboardShell title="My Applications" description="Track all your program applications" navItems={navItems}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i: number) => <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-muted" />)}
        </div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No applications yet.</p>
          <p className="mt-1 text-xs text-muted-foreground">Browse programs and apply to get started.</p>
          <a href="/dashboard/programs"><Button className="mt-4 text-xs">Browse Programs</Button></a>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map(app => (
            <Card key={app.id} className="overflow-hidden">
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{app.program?.name || 'Program'}</p>
                    <Badge className={`border text-xs ${STATUS_COLORS[app.status] || 'border-border bg-muted text-muted-foreground'}`}>
                      {app.status?.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {app.program?.type} · {app.submittedAt ? `Submitted ${new Date(app.submittedAt).toLocaleDateString()}` : 'Draft'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {app.status === 'DRAFT' && (
                    <>
                      <Button onClick={() => handleSubmit(app.id)} disabled={actionLoading === app.id}
                        className="h-8 gap-1 text-xs"><Send size={12} /> Submit</Button>
                      <Button variant="outline" onClick={() => handleDelete(app.id)} disabled={actionLoading === app.id}
                        className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/5"><Trash2 size={12} /></Button>
                    </>
                  )}
                  <button onClick={() => setExpandedId(expandedId === app.id ? null : app.id)} className="rounded-lg p-1 hover:bg-muted">
                    <ChevronDown size={14} className={`transition-transform ${expandedId === app.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {expandedId === app.id && (
                <div className="border-t border-border bg-muted/30 px-4 py-3">
                  <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                    <div><span className="text-muted-foreground">Program Type</span><p className="font-medium">{app.program?.type || '—'}</p></div>
                    <div><span className="text-muted-foreground">Deadline</span><p className="font-medium">{app.program?.deadline ? new Date(app.program.deadline).toLocaleDateString() : '—'}</p></div>
                    <div><span className="text-muted-foreground">Evaluations</span><p className="font-medium">{app._count?.evaluations ?? 0}</p></div>
                    <div><span className="text-muted-foreground">Application ID</span><p className="font-mono font-medium">{app.id?.slice(0, 8)}...</p></div>
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

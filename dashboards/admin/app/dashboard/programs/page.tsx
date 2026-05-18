'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, Check, AlertCircle } from 'lucide-react'
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

type Program = {
  id: string
  name: string
  type: string
  description: string
  eligibility: string
  deadline: string
  isActive: boolean
  applicationCount: number
  createdAt: string
}

const PROGRAM_TYPES = ['FUNDING', 'INCUBATION', 'ACCELERATION', 'COMPETITION', 'MENTORSHIP', 'WORKSPACE', 'TRAINING']

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

export default function ProgramsPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'FUNDING', description: '', eligibility: '', deadline: '' })

  useEffect(() => {
    const session = getSession()
    if (!session) { router.push('/login'); return }
    loadPrograms()
  }, [router])

  async function loadPrograms() {
    setLoading(true)
    try {
      const data = await apiFetch('/programs?limit=50')
      setPrograms(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load programs')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!form.name || !form.deadline) return
    setSaving(true)
    try {
      if (editingId) {
        await apiFetch(`/programs/${editingId}`, { method: 'PATCH', body: JSON.stringify(form) })
      } else {
        await apiFetch('/programs', { method: 'POST', body: JSON.stringify(form) })
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ name: '', type: 'FUNDING', description: '', eligibility: '', deadline: '' })
      await loadPrograms()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save program')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this program?')) return
    try {
      await apiFetch(`/programs/${id}`, { method: 'DELETE' })
      await loadPrograms()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete program')
    }
  }

  async function handleClose(id: string) {
    try {
      await apiFetch(`/programs/${id}/close`, { method: 'PATCH' })
      await loadPrograms()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close program')
    }
  }

  function startEdit(p: Program) {
    setForm({ name: p.name, type: p.type, description: p.description, eligibility: p.eligibility, deadline: p.deadline.split('T')[0] })
    setEditingId(p.id)
    setShowForm(true)
  }

  return (
    <DashboardShell title="Programs" description="Manage funding and support programs" navItems={navItems}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{programs.length} programs total</p>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', type: 'FUNDING', description: '', eligibility: '', deadline: '' }) }} className="gap-2 text-xs">
          <Plus size={14} /> New Program
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-sm font-semibold">{editingId ? 'Edit Program' : 'Create Program'}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Program Name *</span>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary" placeholder="e.g. Seed Accelerator 2026" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Type *</span>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary">
                {PROGRAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="block space-y-1 md:col-span-2">
              <span className="text-xs font-medium text-muted-foreground">Description</span>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Program description..." />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Eligibility</span>
              <input value={form.eligibility} onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary" placeholder="e.g. Early-stage startups" />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Deadline *</span>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="gap-2 text-xs"><Check size={14} /> {saving ? 'Saving...' : 'Save Program'}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null) }} className="text-xs"><X size={14} /> Cancel</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading programs...</div>
      ) : programs.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No programs yet. Create your first program above.</Card>
      ) : (
        <div className="space-y-3">
          {programs.map(p => (
            <Card key={p.id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">{p.name}</h2>
                    <Badge className={p.isActive ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-slate-200 bg-slate-100 text-slate-600'}>
                      {p.isActive ? 'Active' : 'Closed'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.type} • Deadline: {new Date(p.deadline).toLocaleDateString()} • {p.applicationCount ?? 0} applications</p>
                  {p.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{p.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {p.isActive && (
                    <Button variant="outline" onClick={() => handleClose(p.id)} className="h-8 gap-1 text-xs text-orange-600 hover:bg-orange-50">
                      Close
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => startEdit(p)} className="h-8 gap-1 text-xs">
                    <Pencil size={12} /> Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleDelete(p.id)} className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/5">
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

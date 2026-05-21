'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { getPrograms, createProgram, updateProgram, deleteProgram, closeProgram, type ProgramListItem } from '@/lib/api'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Loader2, Calendar } from 'lucide-react'

const navItems = [
  { href: '/dashboard/staff', label: 'Dashboard' },
  { href: '/dashboard/staff/programs', label: 'Programs' },
  { href: '/dashboard/staff/applications', label: 'Applications' },
  { href: '/dashboard/staff/users', label: 'Users' },
  { href: '/dashboard/staff/reports', label: 'Reports' },
  { href: '/dashboard/staff/settings', label: 'Settings' },
]

const PROGRAM_TYPES = ['FUNDING', 'INCUBATION', 'ACCELERATION', 'COMPETITION', 'MENTORSHIP', 'WORKSPACE', 'TRAINING']

const emptyForm = { name: '', type: 'FUNDING', description: '', eligibility: '', deadline: '' }

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setPrograms(await getPrograms()) }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to load') }
    finally { setLoading(false) }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.deadline) return
    setSaving(true)
    try {
      if (editingId) await updateProgram(editingId, form)
      else await createProgram(form)
      setShowForm(false); setEditingId(null); setForm(emptyForm)
      await load()
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to save') }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this program? This cannot be undone.')) return
    setActionLoading(id)
    try { await deleteProgram(id); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to delete') }
    finally { setActionLoading(null) }
  }

  async function handleClose(id: string) {
    setActionLoading(id)
    try { await closeProgram(id); await load() }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to close') }
    finally { setActionLoading(null) }
  }

  function startEdit(p: ProgramListItem) {
    setForm({ name: p.name, type: p.type, description: (p as any).description ?? '', eligibility: (p as any).eligibility ?? '', deadline: p.deadline.split('T')[0] })
    setEditingId(p.id); setShowForm(true)
  }

  return (
    <DashboardShell title="Programs" description="Create and manage funding and support programs" navItems={navItems} portalLabel="STAFF ADMIN">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} className="shrink-0" /> {error}
          <button onClick={() => setError('')} className="ml-auto text-xs underline">Dismiss</button>
        </div>
      )}

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{programs.length} programs</p>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm) }}
          className="flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
          <Plus size={15} /> New Program
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-foreground">{editingId ? 'Edit Program' : 'Create Program'}</h2>
          <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="ink-label">Program Name *</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="ink-input" placeholder="e.g. Seed Accelerator 2026" />
            </div>
            <div>
              <label className="ink-label">Type *</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="ink-input">
                {PROGRAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="ink-label">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} className="ink-input h-auto py-2.5 resize-none" placeholder="Program description…" />
            </div>
            <div>
              <label className="ink-label">Eligibility</label>
              <input value={form.eligibility} onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))}
                className="ink-input" placeholder="e.g. Early-stage startups" />
            </div>
            <div>
              <label className="ink-label">Deadline *</label>
              <input type="date" required value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="ink-input" />
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button type="submit" disabled={saving}
                className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Check size={14} />{editingId ? 'Update' : 'Create'} Program</>}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }}
                className="flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <X size={14} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i: number) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
      ) : programs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No programs yet. Create your first program above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {programs.map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${p.isOpen ? 'border-green-200 bg-green-50 text-green-700' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                    {p.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{p.type}</span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(p.deadline).toLocaleDateString()}</span>
                  <span>{p.applicationCount} applications</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {p.isOpen && (
                  <button onClick={() => handleClose(p.id)} disabled={actionLoading === p.id}
                    className="h-8 rounded-lg border border-orange-200 bg-orange-50 px-3 text-xs font-medium text-orange-700 transition-colors hover:bg-orange-100 disabled:opacity-50">
                    Close
                  </button>
                )}
                <button onClick={() => startEdit(p)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted">
                  <Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={actionLoading === p.id}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50">
                  {actionLoading === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

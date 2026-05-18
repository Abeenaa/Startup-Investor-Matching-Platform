'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Search } from 'lucide-react'
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

type User = {
  id: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

const ROLES = ['STARTUP', 'INVESTOR', 'REVIEWER', 'STAFF_ADMIN', 'SYSTEM_ADMIN']

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

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', role: 'REVIEWER', isActive: true })

  useEffect(() => {
    const session = getSession()
    if (!session) { router.push('/login'); return }
    loadUsers()
  }, [router])

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await apiFetch('/admin/users?page=1&limit=100')
      setUsers(data.data || data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!form.email) return
    setSaving(true)
    try {
      if (editingId) {
        await apiFetch(`/admin/users/${editingId}`, { method: 'PATCH', body: JSON.stringify({ role: form.role, isActive: form.isActive }) })
      } else {
        await apiFetch('/admin/users', { method: 'POST', body: JSON.stringify(form) })
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ email: '', password: '', role: 'REVIEWER', isActive: true })
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try {
      await apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  function startEdit(u: User) {
    setForm({ email: u.email, password: '', role: u.role, isActive: u.isActive })
    setEditingId(u.id)
    setShowForm(true)
  }

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const roleColor: Record<string, string> = {
    STARTUP: 'border-green-200 bg-green-50 text-green-700',
    INVESTOR: 'border-blue-200 bg-blue-50 text-blue-700',
    REVIEWER: 'border-purple-200 bg-purple-50 text-purple-700',
    STAFF_ADMIN: 'border-orange-200 bg-orange-50 text-orange-700',
    SYSTEM_ADMIN: 'border-red-200 bg-red-50 text-red-700',
  }

  return (
    <DashboardShell title="Users" description="Manage all platform user accounts" navItems={navItems}>
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle size={14} /> {error}
          <button onClick={() => setError('')} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email..." className="h-9 w-full rounded-xl border border-input bg-background pl-8 pr-3 text-sm outline-none focus:border-primary" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="h-9 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary">
            <option value="ALL">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({ email: '', password: '', role: 'REVIEWER', isActive: true }) }} className="gap-2 text-xs">
          <Plus size={14} /> New User
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-sm font-semibold">{editingId ? 'Edit User' : 'Create User'}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Email *</span>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} disabled={!!editingId} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary disabled:opacity-50" placeholder="user@innobiz.et" />
            </label>
            {!editingId && (
              <label className="block space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Password *</span>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary" placeholder="Min 8 characters" />
              </label>
            )}
            <label className="block space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Role *</span>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary">
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </label>
            {editingId && (
              <label className="flex items-center gap-2 space-y-0 pt-6">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="h-4 w-4 rounded" />
                <span className="text-sm text-foreground">Active account</span>
              </label>
            )}
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="gap-2 text-xs"><Check size={14} /> {saving ? 'Saving...' : 'Save User'}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null) }} className="text-xs"><X size={14} /> Cancel</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading users...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">No users found.</Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => (
            <Card key={u.id} className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{u.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Created {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`border ${roleColor[u.role] || 'border-border bg-muted text-muted-foreground'}`}>{u.role.replace('_', ' ')}</Badge>
                  <Badge className={u.isActive ? 'border border-green-200 bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" onClick={() => startEdit(u)} className="h-8 gap-1 text-xs"><Pencil size={12} /> Edit</Button>
                  <Button variant="outline" onClick={() => handleDelete(u.id)} className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/5"><Trash2 size={12} /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}

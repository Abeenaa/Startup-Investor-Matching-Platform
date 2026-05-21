'use client'

import { useEffect, useState } from 'react'
import { Check, AlertCircle, X, Loader2, User, Building2, Phone, FileText, Calendar } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { getMyProfile, createProfile, updateProfile } from '@/lib/api'

const navItems = [
  { href: '/dashboard/startup', label: 'Dashboard' },
  { href: '/dashboard/startup/profile', label: 'My Profile' },
  { href: '/dashboard/startup/applications', label: 'My Applications' },
  { href: '/dashboard/startup/programs', label: 'Browse Programs' },
  { href: '/dashboard/startup/settings', label: 'Settings' },
]

const SECTORS = ['Technology', 'Agriculture', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Manufacturing', 'Energy', 'Transportation', 'Tourism', 'Other']
const STAGES = ['Idea', 'Prototype', 'MVP', 'Seed', 'Early Growth', 'Growth', 'Expansion', 'Mature']
const LEGAL_STRUCTURES = ['Sole Proprietorship', 'Private Limited Company', 'Share Company', 'Partnership', 'Cooperative', 'Other']

const STEPS = [
  { id: 1, label: 'Basic Info', icon: Building2 },
  { id: 2, label: 'Details', icon: FileText },
  { id: 3, label: 'Compliance', icon: Phone },
]

const emptyForm = {
  name: '', sector: 'Technology', stage: 'Idea', description: '',
  problemSolved: '', targetMarket: '', innovation: '',
  teamSize: '', website: '', fundingHistory: '',
  phoneNumber: '', tinNumber: '', legalStructure: 'Sole Proprietorship', yearFounded: '',
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    getMyProfile()
      .then(p => {
        if (p) {
          setProfile(p)
          setForm({
            name: p.name ?? '',
            sector: p.sector ?? 'Technology',
            stage: p.stage ?? 'Idea',
            description: p.description ?? '',
            problemSolved: p.problemSolved ?? '',
            targetMarket: p.targetMarket ?? '',
            innovation: p.innovation ?? '',
            teamSize: p.teamSize?.toString() ?? '',
            website: p.website ?? '',
            fundingHistory: p.fundingHistory ?? '',
            phoneNumber: p.phoneNumber ?? '',
            tinNumber: p.tinNumber ?? '',
            legalStructure: p.legalStructure ?? 'Sole Proprietorship',
            yearFounded: p.yearFounded?.toString() ?? '',
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function validateStep(s: number): string | null {
    if (s === 1) {
      if (!form.name.trim()) return 'Startup name is required'
      if (form.name.length < 2) return 'Name must be at least 2 characters'
      if (!form.sector) return 'Sector is required'
      if (!form.stage) return 'Stage is required'
      if (form.description.length < 50) return 'Description must be at least 50 characters'
    }
    if (s === 2) {
      if (form.problemSolved.length < 50) return 'Problem description must be at least 50 characters'
      if (form.targetMarket.length < 20) return 'Target market must be at least 20 characters'
      if (form.innovation.length < 50) return 'Innovation description must be at least 50 characters'
    }
    if (s === 3) {
      if (!form.phoneNumber.trim()) return 'Phone number is required'
      if (!form.tinNumber.trim()) return 'TIN number is required'
      if (!form.legalStructure) return 'Legal structure is required'
      if (!form.yearFounded) return 'Year founded is required'
      const year = parseInt(form.yearFounded)
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) return 'Invalid year founded'
    }
    return null
  }

  function handleNext() {
    const err = validateStep(step)
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const err = validateStep(3)
    if (err) { setError(err); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      const payload = {
        ...form,
        teamSize: form.teamSize ? parseInt(form.teamSize) : undefined,
        yearFounded: parseInt(form.yearFounded),
      }
      if (profile) {
        await updateProfile(payload)
        setSuccess('Profile updated successfully')
      } else {
        const created = await createProfile(payload)
        setProfile(created)
        setSuccess('Profile created! Pending admin approval.')
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <DashboardShell title="My Profile" description="Manage your startup profile" navItems={navItems} portalLabel="STARTUP PORTAL">
      <div className="space-y-3">{[...Array(3)].map((_, i: number) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
    </DashboardShell>
  )

  return (
    <DashboardShell title="My Profile" description="Build your startup's digital presence on Innobiz-K" navItems={navItems} portalLabel="STARTUP PORTAL">
      <div className="mx-auto max-w-2xl">

        {/* Status banner */}
        {profile && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-foreground">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.sector} · {profile.stage}</p>
            </div>
            <Badge className={
              profile.approvalStatus === 'APPROVED' ? 'border border-green-200 bg-green-50 text-green-700' :
              profile.approvalStatus === 'REJECTED' ? 'border border-red-200 bg-red-50 text-red-700' :
              'border border-yellow-200 bg-yellow-50 text-yellow-700'
            }>{profile.approvalStatus}</Badge>
          </div>
        )}

        {/* Step indicator */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i: number) => {
            const Icon = s.icon
            const done = step > s.id
            const active = step === s.id
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  done ? 'bg-green-500 text-white' : active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {done ? <Check size={14} /> : s.id}
                </div>
                <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? 'bg-green-500' : 'bg-border'}`} />}
              </div>
            )
          })}
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <Check size={15} className="shrink-0" />{success}
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle size={15} className="shrink-0" />{error}
            <button onClick={() => setError('')} className="ml-auto"><X size={13} /></button>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

            {/* Step 1 — Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Basic Information</h2>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Startup Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} required
                    className="ink-input" placeholder="e.g. Blue Nile Labs" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sector *</label>
                    <select value={form.sector} onChange={e => set('sector', e.target.value)} className="ink-input">
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Stage *</label>
                    <select value={form.stage} onChange={e => set('stage', e.target.value)} className="ink-input">
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Description * <span className="text-muted-foreground/60">({form.description.length}/1000, min 50)</span>
                  </label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                    className="ink-input h-auto py-2.5 resize-none" placeholder="Describe your startup in detail…" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Team Size</label>
                    <input type="number" min={1} value={form.teamSize} onChange={e => set('teamSize', e.target.value)}
                      className="ink-input" placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Website</label>
                    <input type="url" value={form.website} onChange={e => set('website', e.target.value)}
                      className="ink-input" placeholder="https://…" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Problem, Market & Innovation</h2>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Problem Solved * <span className="text-muted-foreground/60">({form.problemSolved.length}/1000, min 50)</span>
                  </label>
                  <textarea value={form.problemSolved} onChange={e => set('problemSolved', e.target.value)} rows={4}
                    className="ink-input h-auto py-2.5 resize-none" placeholder="What problem does your startup solve?" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Target Market * <span className="text-muted-foreground/60">({form.targetMarket.length}/500, min 20)</span>
                  </label>
                  <textarea value={form.targetMarket} onChange={e => set('targetMarket', e.target.value)} rows={3}
                    className="ink-input h-auto py-2.5 resize-none" placeholder="Who are your target customers?" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Innovation * <span className="text-muted-foreground/60">({form.innovation.length}/1000, min 50)</span>
                  </label>
                  <textarea value={form.innovation} onChange={e => set('innovation', e.target.value)} rows={4}
                    className="ink-input h-auto py-2.5 resize-none" placeholder="What makes your solution innovative?" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Funding History</label>
                  <input value={form.fundingHistory} onChange={e => set('fundingHistory', e.target.value)}
                    className="ink-input" placeholder="e.g. Bootstrapped, $50K seed round" />
                </div>
              </div>
            )}

            {/* Step 3 — Compliance */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-foreground">Government Compliance</h2>
                <p className="text-xs text-muted-foreground">Required for registration on the Innobiz-K platform.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone Number *</label>
                    <input value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} required
                      className="ink-input" placeholder="+251 9XX XXX XXXX" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">TIN Number *</label>
                    <input value={form.tinNumber} onChange={e => set('tinNumber', e.target.value)} required
                      className="ink-input" placeholder="Tax Identification Number" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Legal Structure *</label>
                    <select value={form.legalStructure} onChange={e => set('legalStructure', e.target.value)} className="ink-input">
                      {LEGAL_STRUCTURES.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Year Founded *</label>
                    <input type="number" min={1900} max={new Date().getFullYear()} value={form.yearFounded}
                      onChange={e => set('yearFounded', e.target.value)} required
                      className="ink-input" placeholder={new Date().getFullYear().toString()} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => { setStep(s => s - 1); setError('') }}
                className="flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                ← Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button type="button" onClick={handleNext}
                className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">
                Next →
              </button>
            ) : (
              <button type="submit" disabled={saving}
                className="flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60">
                {saving ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Check size={14} />{profile ? 'Update Profile' : 'Create Profile'}</>}
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}

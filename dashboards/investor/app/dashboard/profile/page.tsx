'use client'

import { useEffect, useState } from 'react'
import { Check, AlertCircle, X, Loader2 } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Badge } from '@/components/ui/badge'
import { getMyProfile, createProfile, updateProfile } from '@/lib/api'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/discover', label: 'Discover Startups' },
  { href: '/dashboard/matches', label: 'My Matches' },
  { href: '/dashboard/programs', label: 'Programs' },
  { href: '/dashboard/profile', label: 'My Profile' },
  { href: '/dashboard/settings', label: 'Settings' },
]

const SECTORS = ['Technology', 'Agriculture', 'Healthcare', 'Education', 'Finance', 'E-commerce', 'Manufacturing', 'Energy', 'Transportation', 'Tourism', 'Other']
const INVESTMENT_STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Late Stage']
const FUNDING_CAPACITIES = ['Under $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M+']
const GEOGRAPHIC_FOCUS = ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Hawassa', 'Bahir Dar', 'Jimma', 'Adama', 'Ethiopia (National)', 'East Africa', 'Africa', 'Global']
const REGISTRATION_TYPES = ['Individual', 'VC Firm', 'Angel Network', 'Corporate', 'Government', 'Foundation', 'Other']
const MINIMUM_INVESTMENTS = ['$1K-$5K', '$5K-$10K', '$10K-$25K', '$25K-$50K', '$50K-$100K', '$100K-$250K', '$250K-$500K', '$500K+']

const STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Investment Preferences' },
  { id: 3, label: 'Compliance' },
]

function MultiSelect({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void
}) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label} *</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              selected.includes(opt)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}>
            {opt}
          </button>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground">{selected.length} selected</p>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    organizationType: '',
    investmentStage: [] as string[],
    sectorFocus: [] as string[],
    fundingCapacity: FUNDING_CAPACITIES[0],
    geographicFocus: [] as string[],
    phoneNumber: '',
    registrationType: REGISTRATION_TYPES[0],
    minimumInvestment: MINIMUM_INVESTMENTS[0],
  })

  useEffect(() => {
    getMyProfile()
      .then(p => {
        if (p) {
          setProfile(p)
          setForm({
            name: p.name ?? '',
            organizationType: p.organizationType ?? '',
            investmentStage: p.investmentStage ?? [],
            sectorFocus: p.sectorFocus ?? [],
            fundingCapacity: p.fundingCapacity ?? FUNDING_CAPACITIES[0],
            geographicFocus: p.geographicFocus ?? [],
            phoneNumber: p.phoneNumber ?? '',
            registrationType: p.registrationType ?? REGISTRATION_TYPES[0],
            minimumInvestment: p.minimumInvestment ?? MINIMUM_INVESTMENTS[0],
          })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function set(key: string, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function validateStep(s: number): string | null {
    if (s === 1) {
      if (!form.name.trim() || form.name.length < 2) return 'Name must be at least 2 characters'
    }
    if (s === 2) {
      if (form.investmentStage.length === 0) return 'Select at least one investment stage'
      if (form.sectorFocus.length === 0) return 'Select at least one sector'
      if (form.geographicFocus.length === 0) return 'Select at least one geographic focus'
    }
    if (s === 3) {
      if (!form.phoneNumber.trim()) return 'Phone number is required'
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
      if (profile) {
        await updateProfile(form)
        setSuccess('Profile updated successfully')
      } else {
        const created = await createProfile(form)
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
    <DashboardShell title="My Profile" description="Manage your investor profile" navItems={navItems} portalLabel="INVESTOR PORTAL">
      <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
    </DashboardShell>
  )

  return (
    <DashboardShell title="My Profile" description="Set up your investment preferences and compliance details" navItems={navItems} portalLabel="INVESTOR PORTAL">
      <div className="mx-auto max-w-2xl">

        {/* Status */}
        {profile && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.registrationType}</p>
            </div>
            <Badge className={
              profile.approvalStatus === 'APPROVED' ? 'border border-green-200 bg-green-50 text-green-700' :
              profile.approvalStatus === 'REJECTED' ? 'border border-red-200 bg-red-50 text-red-700' :
              'border border-yellow-200 bg-yellow-50 text-yellow-700'
            }>{profile.approvalStatus}</Badge>
          </div>
        )}

        {/* Steps */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((s, i) => {
            const done = step > s.id; const active = step === s.id
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  {done ? <Check size={14} /> : s.id}
                </div>
                <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
                {i < STEPS.length - 1 && <div className={`h-px flex-1 ${done ? 'bg-green-500' : 'bg-border'}`} />}
              </div>
            )
          })}
        </div>

        {success && <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"><Check size={15} className="shrink-0" />{success}</div>}
        {error && <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"><AlertCircle size={15} className="shrink-0" />{error}<button onClick={() => setError('')} className="ml-auto"><X size={13} /></button></div>}

        <form onSubmit={handleSave}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold">Basic Information</h2>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full Name / Organization Name *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} required className="ink-input" placeholder="e.g. Nile Ventures" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Organization Type</label>
                  <input value={form.organizationType} onChange={e => set('organizationType', e.target.value)} className="ink-input" placeholder="e.g. Venture Capital Firm" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Funding Capacity *</label>
                  <select value={form.fundingCapacity} onChange={e => set('fundingCapacity', e.target.value)} className="ink-input">
                    {FUNDING_CAPACITIES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-sm font-semibold">Investment Preferences</h2>
                <MultiSelect label="Investment Stages" options={INVESTMENT_STAGES} selected={form.investmentStage} onChange={v => set('investmentStage', v)} />
                <MultiSelect label="Sector Focus" options={SECTORS} selected={form.sectorFocus} onChange={v => set('sectorFocus', v)} />
                <MultiSelect label="Geographic Focus" options={GEOGRAPHIC_FOCUS} selected={form.geographicFocus} onChange={v => set('geographicFocus', v)} />
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold">Compliance & Contact</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone Number *</label>
                    <input value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} required className="ink-input" placeholder="+251 9XX XXX XXXX" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Registration Type *</label>
                    <select value={form.registrationType} onChange={e => set('registrationType', e.target.value)} className="ink-input">
                      {REGISTRATION_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Minimum Investment *</label>
                    <select value={form.minimumInvestment} onChange={e => set('minimumInvestment', e.target.value)} className="ink-input">
                      {MINIMUM_INVESTMENTS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => { setStep(s => s - 1); setError('') }}
                className="flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:bg-muted">
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

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/investor/dashboard',  label: 'Dashboard'         },
  { path: '/investor/profile',    label: 'My Profile'        },
  { path: '/investor/directory',  label: 'Startup Directory' },
  { path: '/investor/saved',      label: 'Saved Startups'    },
]

const INVESTMENT_STAGES = ['Pre-Seed','Seed','Series A','Series B','Series C+','Growth','Late Stage']
const SECTOR_OPTIONS    = ['Technology','Agriculture','Healthcare','Education','Finance','E-commerce','Manufacturing','Energy','Transportation','Tourism','Other']
const FUNDING_CAPS      = ['Under $10K','$10K - $50K','$50K - $100K','$100K - $500K','$500K - $1M','$1M - $5M','$5M+']
const GEO_OPTIONS       = ['Addis Ababa','Dire Dawa','Mekelle','Gondar','Hawassa','Bahir Dar','Jimma','Adama','Ethiopia (National)','East Africa','Africa','Global']
const ORG_TYPES         = ['Individual Angel','Angel Network','Venture Capital','Private Equity','Family Office','Corporate VC','Government Fund','NGO / Foundation']

const inputBase = {
  width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: '10px 14px', fontSize: 14, color: '#1E1E1E',
  backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box',
}
const disabledInput = { ...inputBase, backgroundColor: '#f9fafb', color: '#6b7280', cursor: 'default' }

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-500">{label}</label>
      {children}
    </div>
  )
}

function TagList({ items, color }) {
  if (!items?.length) return <span className="text-sm text-gray-400">—</span>
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(i => (
        <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ backgroundColor: color + '18', color }}>
          {i}
        </span>
      ))}
    </div>
  )
}

function MultiSelect({ options, selected, onChange, color }) {
  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className="text-xs px-3 py-1.5 rounded-full font-medium transition border"
            style={{ backgroundColor: active ? color : '#fff', color: active ? '#fff' : '#6b7280', borderColor: active ? color : '#e5e7eb' }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

const STATUS_STYLE = {
  APPROVED: { bg: '#28C3BE15', color: '#009BAA' },
  PENDING:  { bg: '#FFC30015', color: '#b38600' },
  REJECTED: { bg: '#ff000015', color: '#cc0000' },
}

export default function InvestorProfile() {
  const navigate = useNavigate()
  const [editing,  setEditing]  = useState(false)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [profile,  setProfile]  = useState(null)
  const [form,     setForm]     = useState({
    name: '', organizationType: '', fundingCapacity: '',
    investmentStage: [], sectorFocus: [], geographicFocus: [],
  })

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const token = localStorage.getItem('token')
        const res   = await fetch('/api/investors/profile', { headers: { Authorization: `Bearer ${token}` } })
        const data  = await res.json()
        if (!res.ok) throw new Error(data.message)
        setProfile(data.data)
        setForm({
          name:             data.data.name             || '',
          organizationType: data.data.organizationType || '',
          fundingCapacity:  data.data.fundingCapacity  || '',
          investmentStage:  data.data.investmentStage  || [],
          sectorFocus:      data.data.sectorFocus      || [],
          geographicFocus:  data.data.geographicFocus  || [],
        })
      } catch (err) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  const set = (field) => (e) => { setForm(p => ({ ...p, [field]: e.target.value })); setError(''); setSuccess('') }

  const handleSave = async () => {
    setSaving(true); setError(''); setSuccess('')
    try {
      const token = localStorage.getItem('token')
      const res   = await fetch('/api/investors/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update failed')
      setProfile(data.data); setEditing(false); setSuccess('Profile updated successfully.')
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  const handleCancel = () => {
    if (profile) setForm({
      name: profile.name || '', organizationType: profile.organizationType || '',
      fundingCapacity: profile.fundingCapacity || '',
      investmentStage: profile.investmentStage || [],
      sectorFocus: profile.sectorFocus || [],
      geographicFocus: profile.geographicFocus || [],
    })
    setEditing(false); setError('')
  }

  if (loading) return (
    <DashboardLayout navItems={NAV} hubLabel="Investor Hub">
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading profile...</div>
    </DashboardLayout>
  )

  const statusStyle = STATUS_STYLE[profile?.approvalStatus] || STATUS_STYLE.PENDING

  return (
    <DashboardLayout navItems={NAV} hubLabel="Investor Hub">
      <div className="max-w-3xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/investor/dashboard')} className="text-gray-400 hover:text-ink-black transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-ink-black">Investor Profile</h1>
              <p className="text-xs text-gray-400">Manage your investment preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile?.approvalStatus && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                {profile.approvalStatus}
              </span>
            )}
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition"
                style={{ backgroundColor: '#28C3BE' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}>
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
                  style={{ backgroundColor: '#28C3BE' }}
                  onMouseOver={e => { if (!saving) e.currentTarget.style.backgroundColor = '#009BAA' }}
                  onMouseOut={e => { if (!saving) e.currentTarget.style.backgroundColor = '#28C3BE' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {error   && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}
        {success && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">{success}</div>}

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">

          {/* Name + Org Type */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Name / Organization">
              {editing
                ? <input style={inputBase} value={form.name} onChange={set('name')} placeholder="Your name or org" />
                : <input style={disabledInput} value={form.name} readOnly />}
            </Field>
            <Field label="Organization Type">
              {editing
                ? <select style={inputBase} value={form.organizationType} onChange={set('organizationType')}>
                    <option value="">Select type</option>
                    {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                : <input style={disabledInput} value={form.organizationType || '—'} readOnly />}
            </Field>
          </div>

          {/* Funding Capacity */}
          <Field label="Funding Capacity">
            {editing
              ? <select style={inputBase} value={form.fundingCapacity} onChange={set('fundingCapacity')}>
                  <option value="">Select range</option>
                  {FUNDING_CAPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              : <input style={disabledInput} value={form.fundingCapacity || '—'} readOnly />}
          </Field>

          {/* Investment Stages */}
          <Field label="Investment Stages">
            {editing
              ? <MultiSelect options={INVESTMENT_STAGES} selected={form.investmentStage}
                  onChange={v => setForm(p => ({ ...p, investmentStage: v }))} color="#056EDC" />
              : <TagList items={form.investmentStage} color="#056EDC" />}
          </Field>

          {/* Sector Focus */}
          <Field label="Sector Focus">
            {editing
              ? <MultiSelect options={SECTOR_OPTIONS} selected={form.sectorFocus}
                  onChange={v => setForm(p => ({ ...p, sectorFocus: v }))} color="#28C3BE" />
              : <TagList items={form.sectorFocus} color="#28C3BE" />}
          </Field>

          {/* Geographic Focus */}
          <Field label="Geographic Focus">
            {editing
              ? <MultiSelect options={GEO_OPTIONS} selected={form.geographicFocus}
                  onChange={v => setForm(p => ({ ...p, geographicFocus: v }))} color="#FFC300" />
              : <TagList items={form.geographicFocus} color="#FFC300" />}
          </Field>

        </div>
      </div>
    </DashboardLayout>
  )
}

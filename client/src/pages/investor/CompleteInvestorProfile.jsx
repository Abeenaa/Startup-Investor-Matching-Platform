import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InkLogo from '../../components/InkLogo'

const INVESTMENT_STAGES = ['Pre-Seed','Seed','Series A','Series B','Series C+','Growth','Late Stage']
const SECTOR_OPTIONS    = ['Technology','Agriculture','Healthcare','Education','Finance','E-commerce','Manufacturing','Energy','Transportation','Tourism','Other']
const FUNDING_CAPS      = ['Under $10K','$10K - $50K','$50K - $100K','$100K - $500K','$500K - $1M','$1M - $5M','$5M+']
const GEO_OPTIONS       = ['Addis Ababa','Dire Dawa','Mekelle','Gondar','Hawassa','Bahir Dar','Jimma','Adama','Ethiopia (National)','East Africa','Africa','Global']
const ORG_TYPES         = ['Individual Angel','Angel Network','Venture Capital','Private Equity','Family Office','Corporate VC','Government Fund','NGO / Foundation']

const inputBase = "w-full rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none transition"
const inputStyle = (val) => ({
  backgroundColor: val ? '#FAFFD6' : '#fff',
  border: val ? '1.5px solid #28C3BE' : '1.5px solid #e5e7eb',
})

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-black mb-1">
        {label} {required && <span style={{ color: '#28C3BE' }}>*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function MultiSelect({ options, selected, onChange, color = '#28C3BE' }) {
  const toggle = (val) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className="text-xs px-3 py-1.5 rounded-full font-medium transition border"
            style={{
              backgroundColor: active ? color : '#fff',
              color:           active ? '#fff' : '#6b7280',
              borderColor:     active ? color : '#e5e7eb',
            }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function CompleteInvestorProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [errors,  setErrors]  = useState({})

  const [form, setForm] = useState({
    name:             '',
    organizationType: '',
    fundingCapacity:  '',
    investmentStage:  [],
    sectorFocus:      [],
    geographicFocus:  [],
  })

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())              e.name             = 'Name is required'
    if (!form.fundingCapacity)          e.fundingCapacity  = 'Please select funding capacity'
    if (!form.investmentStage.length)   e.investmentStage  = 'Select at least one stage'
    if (!form.sectorFocus.length)       e.sectorFocus      = 'Select at least one sector'
    if (!form.geographicFocus.length)   e.geographicFocus  = 'Select at least one region'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)

    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res   = await fetch('/api/investors/profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create profile')
      navigate('/investor/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-bg flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-4"><InkLogo height={40} /></div>
      <p className="text-sm mb-6" style={{ color: '#1E1E1E80' }}>Complete your investor profile</p>

      <div className="bg-white rounded-xl shadow-sm w-full max-w-lg px-8 py-8">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <Field label="Full Name / Organization Name" required error={errors.name}>
            <input className={inputBase} style={inputStyle(form.name)}
              placeholder="e.g. Horizon Ventures" value={form.name} onChange={set('name')} />
          </Field>

          {/* Org Type */}
          <Field label="Organization Type" error={errors.organizationType}>
            <select className={inputBase} style={{ ...inputStyle(form.organizationType), backgroundColor: form.organizationType ? '#FAFFD6' : '#fff' }}
              value={form.organizationType} onChange={set('organizationType')}>
              <option value="">Select type (optional)</option>
              {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          {/* Funding Capacity */}
          <Field label="Funding Capacity" required error={errors.fundingCapacity}>
            <select className={inputBase} style={{ ...inputStyle(form.fundingCapacity), backgroundColor: form.fundingCapacity ? '#FAFFD6' : '#fff' }}
              value={form.fundingCapacity} onChange={set('fundingCapacity')}>
              <option value="">Select range</option>
              {FUNDING_CAPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          {/* Investment Stages */}
          <Field label="Investment Stages" required error={errors.investmentStage}>
            <MultiSelect options={INVESTMENT_STAGES} selected={form.investmentStage}
              onChange={v => { setForm(p => ({ ...p, investmentStage: v })); setErrors(p => ({ ...p, investmentStage: '' })) }}
              color="#056EDC" />
          </Field>

          {/* Sector Focus */}
          <Field label="Sector Focus" required error={errors.sectorFocus}>
            <MultiSelect options={SECTOR_OPTIONS} selected={form.sectorFocus}
              onChange={v => { setForm(p => ({ ...p, sectorFocus: v })); setErrors(p => ({ ...p, sectorFocus: '' })) }}
              color="#28C3BE" />
          </Field>

          {/* Geographic Focus */}
          <Field label="Geographic Focus" required error={errors.geographicFocus}>
            <MultiSelect options={GEO_OPTIONS} selected={form.geographicFocus}
              onChange={v => { setForm(p => ({ ...p, geographicFocus: v })); setErrors(p => ({ ...p, geographicFocus: '' })) }}
              color="#FFC300" />
          </Field>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60 mt-2"
            style={{ backgroundColor: '#28C3BE' }}
            onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = '#009BAA' }}
            onMouseOut={e => { if (!loading) e.currentTarget.style.backgroundColor = '#28C3BE' }}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

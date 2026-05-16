import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InkLogo from '../../components/InkLogo'

const SECTORS = ['Technology','Agriculture','Healthcare','Education','Finance','E-commerce','Manufacturing','Energy','Transportation','Tourism','Other']
const STAGES  = ['Idea','Prototype','MVP','Seed','Early Growth','Growth','Expansion','Mature']

const STEPS = ['Basic Info', 'Details', 'Team & Extras']

function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 flex-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                backgroundColor: i <= step ? '#28C3BE' : '#e5e7eb',
                color: i <= step ? '#fff' : '#9ca3af',
              }}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-xs hidden sm:block" style={{ color: i <= step ? '#28C3BE' : '#9ca3af' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: i < step ? '#28C3BE' : '#e5e7eb' }} />
          )}
        </div>
      ))}
    </div>
  )
}

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

const inputClass = "w-full rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none transition"
const inputStyle = (val) => ({
  backgroundColor: val ? '#FAFFD6' : '#fff',
  border: val ? '1.5px solid #28C3BE' : '1.5px solid #e5e7eb',
})

export default function CompleteStartupProfile() {
  const navigate = useNavigate()
  const [step, setStep]     = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})
  const [apiError, setApiError] = useState('')

  const [form, setForm] = useState({
    name:           '',
    sector:         '',
    stage:          '',
    description:    '',
    problemSolved:  '',
    targetMarket:   '',
    innovation:     '',
    teamSize:       '',
    fundingHistory: '',
    website:        '',
  })

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  // Validate current step fields
  const validate = () => {
    const e = {}
    if (step === 0) {
      if (!form.name.trim() || form.name.length < 2)   e.name   = 'Startup name must be at least 2 characters'
      if (!form.sector)                                  e.sector = 'Please select a sector'
      if (!form.stage)                                   e.stage  = 'Please select a stage'
      if (form.description.length < 50)                 e.description = 'Description must be at least 50 characters'
    }
    if (step === 1) {
      if (form.problemSolved.length < 50)  e.problemSolved = 'Must be at least 50 characters'
      if (form.targetMarket.length < 20)   e.targetMarket  = 'Must be at least 20 characters'
      if (form.innovation.length < 50)     e.innovation    = 'Must be at least 50 characters'
    }
    if (step === 2) {
      if (form.teamSize && (isNaN(form.teamSize) || form.teamSize < 1)) e.teamSize = 'Must be a valid number'
      if (form.website && !/^https?:\/\/.+/.test(form.website)) e.website = 'Must be a valid URL (https://...)'
    }
    return e
  }

  const next = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    setStep(s => s + 1)
  }

  const submit = async () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)

    setLoading(true)
    setApiError('')
    try {
      const token = localStorage.getItem('token')
      const payload = {
        name:          form.name,
        sector:        form.sector,
        stage:         form.stage,
        description:   form.description,
        problemSolved: form.problemSolved,
        targetMarket:  form.targetMarket,
        innovation:    form.innovation,
        ...(form.teamSize       && { teamSize: parseInt(form.teamSize) }),
        ...(form.fundingHistory && { fundingHistory: form.fundingHistory }),
        ...(form.website        && { website: form.website }),
      }
      const res  = await fetch('/api/startups/profile', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create profile')
      navigate('/startup/dashboard')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-bg flex flex-col items-center justify-center px-4 py-10">

      <div className="mb-4"><InkLogo height={40} /></div>
      <p className="text-sm mb-6" style={{ color: '#1E1E1E80' }}>Complete your startup profile</p>

      <div className="bg-white rounded-xl shadow-sm w-full max-w-lg px-8 py-8">

        <ProgressBar step={step} />

        {apiError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {apiError}
          </div>
        )}

        {/* ── Step 0: Basic Info ── */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-ink-black mb-2">Basic Information</h2>

            <Field label="Startup Name" required error={errors.name}>
              <input className={inputClass} style={inputStyle(form.name)}
                placeholder="e.g. AgriTech Solutions" value={form.name} onChange={set('name')} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Sector" required error={errors.sector}>
                <select className={inputClass} style={{ ...inputStyle(form.sector), backgroundColor: form.sector ? '#FAFFD6' : '#fff' }}
                  value={form.sector} onChange={set('sector')}>
                  <option value="">Select sector</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Stage" required error={errors.stage}>
                <select className={inputClass} style={{ ...inputStyle(form.stage), backgroundColor: form.stage ? '#FAFFD6' : '#fff' }}
                  value={form.stage} onChange={set('stage')}>
                  <option value="">Select stage</option>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Description" required error={errors.description}>
              <textarea className={inputClass} style={inputStyle(form.description)} rows={4}
                placeholder="Describe your startup (min. 50 characters)"
                value={form.description} onChange={set('description')} />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/1000</p>
            </Field>
          </div>
        )}

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-ink-black mb-2">Problem & Innovation</h2>

            <Field label="Problem Being Solved" required error={errors.problemSolved}>
              <textarea className={inputClass} style={inputStyle(form.problemSolved)} rows={3}
                placeholder="What problem does your startup solve? (min. 50 characters)"
                value={form.problemSolved} onChange={set('problemSolved')} />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.problemSolved.length}/1000</p>
            </Field>

            <Field label="Target Market" required error={errors.targetMarket}>
              <textarea className={inputClass} style={inputStyle(form.targetMarket)} rows={3}
                placeholder="Who are your target customers? (min. 20 characters)"
                value={form.targetMarket} onChange={set('targetMarket')} />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.targetMarket.length}/500</p>
            </Field>

            <Field label="Innovation" required error={errors.innovation}>
              <textarea className={inputClass} style={inputStyle(form.innovation)} rows={3}
                placeholder="What makes your solution innovative? (min. 50 characters)"
                value={form.innovation} onChange={set('innovation')} />
              <p className="text-xs text-gray-400 mt-1 text-right">{form.innovation.length}/1000</p>
            </Field>
          </div>
        )}

        {/* ── Step 2: Team & Extras ── */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-ink-black mb-2">Team & Additional Info</h2>

            <Field label="Team Size" error={errors.teamSize}>
              <input type="number" min="1" max="1000" className={inputClass} style={inputStyle(form.teamSize)}
                placeholder="e.g. 5" value={form.teamSize} onChange={set('teamSize')} />
            </Field>

            <Field label="Funding History" error={errors.fundingHistory}>
              <textarea className={inputClass} style={inputStyle(form.fundingHistory)} rows={3}
                placeholder="Previous funding rounds, grants, or investments (optional)"
                value={form.fundingHistory} onChange={set('fundingHistory')} />
            </Field>

            <Field label="Website" error={errors.website}>
              <input type="url" className={inputClass} style={inputStyle(form.website)}
                placeholder="https://yourstartup.com" value={form.website} onChange={set('website')} />
            </Field>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border transition"
              style={{ borderColor: '#28C3BE', color: '#28C3BE' }}
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition"
              style={{ backgroundColor: '#28C3BE' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}
            >
              Next
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ backgroundColor: '#28C3BE' }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.backgroundColor = '#009BAA' }}
              onMouseOut={e => { if (!loading) e.currentTarget.style.backgroundColor = '#28C3BE' }}
            >
              {loading ? 'Submitting...' : 'Submit Profile'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

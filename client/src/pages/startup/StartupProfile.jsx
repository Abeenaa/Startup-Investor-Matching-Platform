import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/startup/dashboard', label: 'Dashboard'  },
  { path: '/startup/profile',   label: 'My Profile' },
  { path: '/startup/programs',  label: 'Programs'   },
  { path: '/startup/investors', label: 'Investors'  },
  { path: '/startup/resources', label: 'Resources'  },
]

const SECTORS = ['Technology','Agriculture','Healthcare','Education','Finance','E-commerce','Manufacturing','Energy','Transportation','Tourism','Other']
const STAGES  = ['Idea','Prototype','MVP','Seed','Early Growth','Growth','Expansion','Mature']

const inputBase = {
  width: '100%',
  border: '1px solid #e5e7eb',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 14,
  color: '#1E1E1E',
  backgroundColor: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
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

export default function StartupProfile() {
  const navigate  = useNavigate()
  const [editing, setEditing]   = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving,  setSaving]    = useState(false)
  const [error,   setError]     = useState('')
  const [success, setSuccess]   = useState('')

  const [profile, setProfile] = useState(null)
  const [form,    setForm]    = useState({
    name:          '',
    sector:        '',
    stage:         '',
    teamSize:      '',
    description:   '',
    website:       '',
    problemSolved: '',
    targetMarket:  '',
    innovation:    '',
    fundingHistory:'',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const res   = await fetch('/api/startups/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data  = await res.json()
        if (!res.ok) throw new Error(data.message)
        setProfile(data.data)
        setForm({
          name:           data.data.name          || '',
          sector:         data.data.sector         || '',
          stage:          data.data.stage          || '',
          teamSize:       data.data.teamSize        ? String(data.data.teamSize) : '',
          description:    data.data.description    || '',
          website:        data.data.website         || '',
          problemSolved:  data.data.problemSolved  || '',
          targetMarket:   data.data.targetMarket   || '',
          innovation:     data.data.innovation     || '',
          fundingHistory: data.data.fundingHistory || '',
        })
      } catch (err) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
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
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update failed')
      setProfile(data.data)
      setEditing(false)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setForm({
        name:           profile.name          || '',
        sector:         profile.sector         || '',
        stage:          profile.stage          || '',
        teamSize:       profile.teamSize        ? String(profile.teamSize) : '',
        description:    profile.description    || '',
        website:        profile.website         || '',
        problemSolved:  profile.problemSolved  || '',
        targetMarket:   profile.targetMarket   || '',
        innovation:     profile.innovation     || '',
        fundingHistory: profile.fundingHistory || '',
      })
    }
    setEditing(false)
    setError('')
  }

  const statusColor = {
    APPROVED: { bg: '#28C3BE15', color: '#009BAA' },
    PENDING:  { bg: '#FFC30015', color: '#b38600' },
    REJECTED: { bg: '#ff000015', color: '#cc0000' },
  }

  if (loading) {
    return (
      <DashboardLayout navItems={NAV} hubLabel="Startup Hub">
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading profile...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navItems={NAV} hubLabel="Startup Hub">
      <div className="max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/startup/dashboard')} className="text-gray-400 hover:text-ink-black transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-ink-black">Startup Profile</h1>
              <p className="text-xs text-gray-400">Manage your company information</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile?.approvalStatus && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={statusColor[profile.approvalStatus] || statusColor.PENDING}
              >
                {profile.approvalStatus}
              </span>
            )}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition"
                style={{ backgroundColor: '#28C3BE' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
                  style={{ backgroundColor: '#28C3BE' }}
                  onMouseOver={e => { if (!saving) e.currentTarget.style.backgroundColor = '#009BAA' }}
                  onMouseOut={e => { if (!saving) e.currentTarget.style.backgroundColor = '#28C3BE' }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">{success}</div>
        )}
        {profile?.approvalStatus === 'REJECTED' && profile?.rejectionReason && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <span className="font-semibold">Rejection reason: </span>{profile.rejectionReason}
          </div>
        )}

        {/* Profile card */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">

          {/* Row 1: Company Name + Stage */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Company Name">
              {editing
                ? <input style={inputBase} value={form.name} onChange={set('name')} placeholder="Your startup name" />
                : <input style={disabledInput} value={form.name} readOnly />
              }
            </Field>
            <Field label="Stage">
              {editing
                ? (
                  <select style={inputBase} value={form.stage} onChange={set('stage')}>
                    <option value="">Select stage</option>
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )
                : <input style={disabledInput} value={form.stage} readOnly />
              }
            </Field>
          </div>

          {/* Row 2: Sector + Team Size */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Sector">
              {editing
                ? (
                  <select style={inputBase} value={form.sector} onChange={set('sector')}>
                    <option value="">Select sector</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )
                : <input style={disabledInput} value={form.sector} readOnly />
              }
            </Field>
            <Field label="Team Size">
              {editing
                ? <input type="number" style={inputBase} value={form.teamSize} onChange={set('teamSize')} placeholder="e.g. 5" min="1" />
                : <input style={disabledInput} value={form.teamSize || '—'} readOnly />
              }
            </Field>
          </div>

          {/* Description */}
          <Field label="Description">
            {editing
              ? <textarea style={{ ...inputBase, minHeight: 100, resize: 'vertical' }} value={form.description} onChange={set('description')} placeholder="Describe your startup (min. 50 characters)" />
              : <textarea style={{ ...disabledInput, minHeight: 100, resize: 'none' }} value={form.description} readOnly />
            }
          </Field>

          {/* Problem Solved */}
          <Field label="Problem Being Solved">
            {editing
              ? <textarea style={{ ...inputBase, minHeight: 80, resize: 'vertical' }} value={form.problemSolved} onChange={set('problemSolved')} placeholder="What problem does your startup solve?" />
              : <textarea style={{ ...disabledInput, minHeight: 80, resize: 'none' }} value={form.problemSolved} readOnly />
            }
          </Field>

          {/* Target Market */}
          <Field label="Target Market">
            {editing
              ? <textarea style={{ ...inputBase, minHeight: 80, resize: 'vertical' }} value={form.targetMarket} onChange={set('targetMarket')} placeholder="Who are your target customers?" />
              : <textarea style={{ ...disabledInput, minHeight: 80, resize: 'none' }} value={form.targetMarket} readOnly />
            }
          </Field>

          {/* Innovation */}
          <Field label="Innovation">
            {editing
              ? <textarea style={{ ...inputBase, minHeight: 80, resize: 'vertical' }} value={form.innovation} onChange={set('innovation')} placeholder="What makes your solution innovative?" />
              : <textarea style={{ ...disabledInput, minHeight: 80, resize: 'none' }} value={form.innovation} readOnly />
            }
          </Field>

          {/* Row: Website + Funding History */}
          <div className="grid grid-cols-2 gap-5">
            <Field label="Website">
              {editing
                ? <input type="url" style={inputBase} value={form.website} onChange={set('website')} placeholder="https://yourstartup.com" />
                : <input style={disabledInput} value={form.website || '—'} readOnly />
              }
            </Field>
            <Field label="Funding History">
              {editing
                ? <input style={inputBase} value={form.fundingHistory} onChange={set('fundingHistory')} placeholder="e.g. Pre-seed $50K, 2024" />
                : <input style={disabledInput} value={form.fundingHistory || '—'} readOnly />
              }
            </Field>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

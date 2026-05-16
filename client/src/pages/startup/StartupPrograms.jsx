import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/startup/dashboard',     label: 'Dashboard'        },
  { path: '/startup/profile',       label: 'My Profile'       },
  { path: '/startup/programs',      label: 'Programs'         },
  { path: '/startup/applications',  label: 'My Applications'  },
  { path: '/startup/investors',     label: 'Investors'        },
  { path: '/startup/resources',     label: 'Resources'        },
]

// Days until deadline
function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function ProgramStatus({ program }) {
  const days = daysUntil(program.deadline)
  if (!program.isActive || days < 0) {
    return <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>Closed</span>
  }
  if (days <= 7) {
    return <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFC30020', color: '#b38600' }}>Closing Soon</span>
  }
  return <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#28C3BE15', color: '#009BAA' }}>Open</span>
}

// Modal for program details + apply
function ProgramModal({ program, onClose, onApply, applying, applyMsg }) {
  if (!program) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-ink-black text-lg">{program.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{program.type}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-ink-black text-xl leading-none mt-0.5">&#x2715;</button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-gray-700">{program.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Eligibility Criteria</p>
            <p className="text-gray-700">{program.eligibilityCriteria}</p>
          </div>
          {program.expectedOutcomes && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Expected Outcomes</p>
              <p className="text-gray-700">{program.expectedOutcomes}</p>
            </div>
          )}
          {program.benefits?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Benefits</p>
              <div className="flex flex-wrap gap-2">
                {program.benefits.map(b => (
                  <span key={b} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#28C3BE15', color: '#009BAA' }}>{b}</span>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {program.duration && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Duration</p>
                <p className="font-semibold text-ink-black text-sm mt-0.5">{program.duration}</p>
              </div>
            )}
            {program.fundingAmount && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Funding</p>
                <p className="font-semibold text-ink-black text-sm mt-0.5">{program.fundingAmount}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Deadline</p>
              <p className="font-semibold text-ink-black text-sm mt-0.5">{new Date(program.deadline).toLocaleDateString()}</p>
            </div>
          </div>
          {/* Apply error/success inside modal */}
          {applyMsg && (
            <div className="text-sm rounded-lg px-3 py-2"
              style={{ backgroundColor: applyMsg.includes('draft') ? '#28C3BE15' : '#fee2e2', color: applyMsg.includes('draft') ? '#009BAA' : '#dc2626' }}>
              {applyMsg}
            </div>
          )}
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition">
            Close
          </button>
          {program.isOpen && (
            <button
              onClick={() => onApply(program.id)}
              disabled={applying}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ backgroundColor: '#28C3BE' }}
              onMouseOver={e => { if (!applying) e.currentTarget.style.backgroundColor = '#009BAA' }}
              onMouseOut={e => { if (!applying) e.currentTarget.style.backgroundColor = '#28C3BE' }}
            >
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StartupPrograms() {
  const navigate = useNavigate()
  const [programs,  setPrograms]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [selected,  setSelected]  = useState(null)
  const [applying,  setApplying]  = useState(false)
  const [applyMsg,  setApplyMsg]  = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams({ limit: '20' })
        if (typeFilter) params.set('type', typeFilter)
        const res  = await fetch(`/api/programs?${params}`)
        const text = await res.text()
        if (!text) throw new Error('No response from server. Make sure the backend is running.')
        let data
        try { data = JSON.parse(text) } catch { throw new Error('Server returned an invalid response. Check that the backend is running on port 5000.') }
        if (!res.ok) throw new Error(data.message || 'Failed to load programs')
        setPrograms(data.data?.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load programs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [typeFilter])

  const handleApply = async (programId) => {
    setApplying(true)
    setApplyMsg('')
    try {
      const token = localStorage.getItem('token')
      const res   = await fetch('/api/applications', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ programId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Application failed')
      setSelected(null)
      setApplyMsg('Application created as draft. Go to My Applications to complete and submit.')
    } catch (err) {
      setApplyMsg(err.message)
    } finally {
      setApplying(false)
    }
  }

  const TYPES = ['FUNDING','INCUBATION','ACCELERATION','COMPETITION','MENTORSHIP','WORKSPACE','TRAINING']

  return (
    <DashboardLayout navItems={NAV} hubLabel="Startup Hub">
      <div className="max-w-4xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/startup/dashboard')} className="text-gray-400 hover:text-ink-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink-black">Available Programs</h1>
            <p className="text-xs text-gray-400">Browse and apply to startup programs</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setTypeFilter('')}
            className="text-xs px-3 py-1.5 rounded-full font-medium transition"
            style={{ backgroundColor: !typeFilter ? '#28C3BE' : '#f3f4f6', color: !typeFilter ? '#fff' : '#6b7280' }}
          >
            All
          </button>
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition"
              style={{ backgroundColor: typeFilter === t ? '#28C3BE' : '#f3f4f6', color: typeFilter === t ? '#fff' : '#6b7280' }}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Feedback */}
        {applyMsg && (
          <div className="mb-4 text-sm rounded-lg px-4 py-3"
            style={{ backgroundColor: applyMsg.includes('draft') ? '#28C3BE15' : '#fee2e2', color: applyMsg.includes('draft') ? '#009BAA' : '#dc2626', border: `1px solid ${applyMsg.includes('draft') ? '#28C3BE40' : '#fca5a5'}` }}>
            {applyMsg}
            {applyMsg.includes('draft') && (
              <button onClick={() => navigate('/startup/applications')} className="ml-2 underline font-semibold">View Applications</button>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center text-gray-400 text-sm py-16">Loading programs...</div>
        ) : programs.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-16">No programs available at the moment.</div>
        ) : (
          <div className="space-y-4">
            {programs.map(prog => (
              <div key={prog.id} className="bg-white rounded-xl shadow-sm p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 className="font-bold text-ink-black">{prog.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{prog.type.charAt(0) + prog.type.slice(1).toLowerCase()}</p>
                  </div>
                  <ProgramStatus program={prog} />
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-8 mt-4 mb-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>{prog.duration || 'Ongoing'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>{prog.maxApplicants ? `${prog.spotsRemaining ?? prog.maxApplicants} slots` : 'N/A slots'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>Deadline: {new Date(prog.deadline).toLocaleDateString('en-CA')}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-0 rounded-lg overflow-hidden border border-gray-200">
                  <button
                    onClick={() => setSelected(prog)}
                    className="flex-1 py-2.5 text-sm font-semibold text-white transition"
                    style={{ backgroundColor: '#28C3BE' }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => prog.isOpen && handleApply(prog.id)}
                    disabled={!prog.isOpen}
                    className="flex-1 py-2.5 text-sm font-semibold transition"
                    style={{ backgroundColor: '#f9fafb', color: prog.isOpen ? '#1E1E1E' : '#9ca3af', cursor: prog.isOpen ? 'pointer' : 'not-allowed' }}
                    onMouseOver={e => { if (prog.isOpen) e.currentTarget.style.backgroundColor = '#f3f4f6' }}
                    onMouseOut={e => { if (prog.isOpen) e.currentTarget.style.backgroundColor = '#f9fafb' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <ProgramModal
        program={selected}
        onClose={() => { setSelected(null); setApplyMsg('') }}
        onApply={handleApply}
        applying={applying}
        applyMsg={applyMsg}
      />
    </DashboardLayout>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/startup/dashboard',    label: 'Dashboard'       },
  { path: '/startup/profile',      label: 'My Profile'      },
  { path: '/startup/programs',     label: 'Programs'        },
  { path: '/startup/applications', label: 'My Applications' },
  { path: '/startup/investors',    label: 'Investors'       },
  { path: '/startup/resources',    label: 'Resources'       },
]

const STATUS_STYLE = {
  DRAFT:        { bg: '#f3f4f6',    color: '#6b7280' },
  SUBMITTED:    { bg: '#056EDC18', color: '#056EDC' },
  UNDER_REVIEW: { bg: '#FF870018', color: '#FF8700' },
  APPROVED:     { bg: '#28C3BE18', color: '#009BAA' },
  REJECTED:     { bg: '#ff000015', color: '#cc0000' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.DRAFT
  return (
    <span className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}>
      {status.replace('_', ' ')}
    </span>
  )
}

// Detail modal
function AppModal({ app, onClose, onSubmit, onDelete, submitting, deleting }) {
  if (!app) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-ink-black text-lg">{app.program?.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{app.program?.type} · Applied {new Date(app.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-ink-black text-xl">&#x2715;</button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={app.status} />
          </div>
          {app.submittedAt && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Submitted</span>
              <span className="text-ink-black font-medium">{new Date(app.submittedAt).toLocaleDateString()}</span>
            </div>
          )}
          {app.program?.deadline && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Program Deadline</span>
              <span className="text-ink-black font-medium">{new Date(app.program.deadline).toLocaleDateString()}</span>
            </div>
          )}
          {app.additionalInfo && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Additional Info</p>
              <p className="text-gray-700">{app.additionalInfo}</p>
            </div>
          )}
          {app.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-600 mb-1">Rejection Reason</p>
              <p className="text-red-700 text-xs">{app.rejectionReason}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-6 pt-0">
          {app.status === 'DRAFT' && (
            <>
              <button onClick={() => onDelete(app.id)} disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition disabled:opacity-60">
                {deleting ? 'Deleting...' : 'Delete Draft'}
              </button>
              <button onClick={() => onSubmit(app.id)} disabled={submitting}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ backgroundColor: '#28C3BE' }}
                onMouseOver={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#009BAA' }}
                onMouseOut={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#28C3BE' }}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </>
          )}
          {app.status !== 'DRAFT' && (
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition">
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StartupApplications() {
  const navigate   = useNavigate()
  const [apps,     setApps]      = useState([])
  const [loading,  setLoading]   = useState(true)
  const [error,    setError]     = useState('')
  const [selected, setSelected]  = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [msg,      setMsg]       = useState('')

  const token = localStorage.getItem('token')

  const load = async () => {
    try {
      const res  = await fetch('/api/applications/my-applications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const text = await res.text()
      if (!text) throw new Error('No response from server.')
      const data = JSON.parse(text)
      if (!res.ok) throw new Error(data.message)
      setApps(data.data?.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (appId) => {
    setSubmitting(true)
    try {
      const res  = await fetch(`/api/applications/${appId}/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSelected(null)
      setMsg('Application submitted successfully.')
      load()
    } catch (err) {
      setMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (appId) => {
    setDeleting(true)
    try {
      const res  = await fetch(`/api/applications/${appId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setSelected(null)
      setMsg('Draft deleted.')
      load()
    } catch (err) {
      setMsg(err.message)
    } finally {
      setDeleting(false)
    }
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
              <h1 className="text-xl font-bold text-ink-black">My Applications</h1>
              <p className="text-xs text-gray-400">Track your program applications and status</p>
            </div>
          </div>
          <button onClick={() => navigate('/startup/programs')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
            style={{ backgroundColor: '#28C3BE' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}>
            + New Application
          </button>
        </div>

        {msg && (
          <div className="mb-4 text-sm rounded-lg px-4 py-3"
            style={{ backgroundColor: msg.includes('success') || msg.includes('deleted') ? '#28C3BE15' : '#fee2e2', color: msg.includes('success') || msg.includes('deleted') ? '#009BAA' : '#dc2626', border: `1px solid ${msg.includes('success') || msg.includes('deleted') ? '#28C3BE40' : '#fca5a5'}` }}>
            {msg}
          </div>
        )}
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-400 text-sm py-16">Loading applications...</div>
        ) : apps.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-3">No applications yet.</p>
            <button onClick={() => navigate('/startup/programs')}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#28C3BE' }}>
              Browse Programs
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map(app => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelected(app)}>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink-black">{app.program?.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{app.program?.type}</span>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <AppModal
        app={selected}
        onClose={() => { setSelected(null); setMsg('') }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        submitting={submitting}
        deleting={deleting}
      />
    </DashboardLayout>
  )
}

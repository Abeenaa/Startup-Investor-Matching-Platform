import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/investor/dashboard',  label: 'Dashboard'         },
  { path: '/investor/profile',    label: 'My Profile'        },
  { path: '/investor/directory',  label: 'Startup Directory' },
  { path: '/investor/saved',      label: 'Saved Startups'    },
]

const SECTORS = ['Technology','Agriculture','Healthcare','Education','Finance','E-commerce','Manufacturing','Energy','Transportation','Tourism','Other']
const STAGES  = ['Idea','Prototype','MVP','Seed','Early Growth','Growth','Expansion','Mature']

function StartupModal({ startup, onClose, saved, onToggleSave }) {
  if (!startup) return null
  const isSaved = saved.includes(startup.id)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-ink-black text-lg">{startup.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{startup.sector} · {startup.stage}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-ink-black text-xl">&#x2715;</button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-gray-700">{startup.description}</p>
          </div>
          {startup.problemSolved && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Problem Solved</p>
              <p className="text-gray-700">{startup.problemSolved}</p>
            </div>
          )}
          {startup.targetMarket && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Target Market</p>
              <p className="text-gray-700">{startup.targetMarket}</p>
            </div>
          )}
          {startup.innovation && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Innovation</p>
              <p className="text-gray-700">{startup.innovation}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {startup.teamSize && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Team Size</p>
                <p className="font-semibold text-ink-black mt-0.5">{startup.teamSize}</p>
              </div>
            )}
            {startup.website && (
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">Website</p>
                <a href={startup.website} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-semibold truncate block" style={{ color: '#28C3BE' }}>
                  Visit ↗
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition">
            Close
          </button>
          <button onClick={() => onToggleSave(startup.id)}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition"
            style={{ backgroundColor: isSaved ? '#FF8700' : '#28C3BE' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = isSaved ? '#e07600' : '#009BAA'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = isSaved ? '#FF8700' : '#28C3BE'}>
            {isSaved ? 'Remove from Saved' : 'Save Startup'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StartupDirectory() {
  const navigate  = useNavigate()
  const [startups,  setStartups]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')
  const [sector,    setSector]    = useState('')
  const [stage,     setStage]     = useState('')
  const [selected,  setSelected]  = useState(null)
  const [saved,     setSaved]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedStartups') || '[]') } catch { return [] }
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: '20' })
        if (search) params.set('search', search)
        if (sector) params.set('sector', sector)
        if (stage)  params.set('stage', stage)
        const res  = await fetch(`/api/directory/startups?${params}`)
        const text = await res.text()
        if (!text) throw new Error('No response from server.')
        const data = JSON.parse(text)
        if (!res.ok) throw new Error(data.message)
        setStartups(data.data?.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [search, sector, stage])

  const toggleSave = (id) => {
    const updated = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id]
    setSaved(updated)
    localStorage.setItem('savedStartups', JSON.stringify(updated))
  }

  return (
    <DashboardLayout navItems={NAV} hubLabel="Investor Hub">
      <div className="max-w-5xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/investor/dashboard')} className="text-gray-400 hover:text-ink-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-ink-black">Startup Directory</h1>
            <p className="text-xs text-gray-400">Browse approved startups looking for investment</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search startups..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none bg-white"
              style={{ '--tw-ring-color': '#28C3BE' }} />
          </div>
          <select value={sector} onChange={e => setSector(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none min-w-36">
            <option value="">All Sectors</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={stage} onChange={e => setStage(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none min-w-36">
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-400 text-sm py-16">Loading startups...</div>
        ) : startups.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-16">No startups found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {startups.map(s => (
              <div key={s.id} className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
                style={{ borderLeft: '4px solid #28C3BE' }}
                onClick={() => setSelected(s)}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-ink-black text-sm">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.sector} · {s.stage}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); toggleSave(s.id) }}
                    className="text-lg transition-transform hover:scale-110"
                    title={saved.includes(s.id) ? 'Remove from saved' : 'Save startup'}>
                    {saved.includes(s.id) ? '🔖' : '🔗'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{s.description}</p>
                {s.teamSize && (
                  <p className="text-xs text-gray-400 mt-2">Team: {s.teamSize} people</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <StartupModal startup={selected} onClose={() => setSelected(null)} saved={saved} onToggleSave={toggleSave} />
    </DashboardLayout>
  )
}

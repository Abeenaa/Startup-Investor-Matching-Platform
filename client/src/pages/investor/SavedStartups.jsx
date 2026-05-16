import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/investor/dashboard',  label: 'Dashboard'         },
  { path: '/investor/profile',    label: 'My Profile'        },
  { path: '/investor/directory',  label: 'Startup Directory' },
  { path: '/investor/saved',      label: 'Saved Startups'    },
]

export default function SavedStartups() {
  const navigate = useNavigate()
  const [startups, setStartups] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saved,    setSaved]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('savedStartups') || '[]') } catch { return [] }
  })

  useEffect(() => {
    if (!saved.length) { setLoading(false); return }
    const load = async () => {
      try {
        // Fetch each saved startup from the public directory
        const results = await Promise.all(
          saved.map(id =>
            fetch(`/api/directory/startups/${id}`)
              .then(r => r.json())
              .then(d => d.data || null)
              .catch(() => null)
          )
        )
        setStartups(results.filter(Boolean))
      } catch {
        setStartups([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const remove = (id) => {
    const updated = saved.filter(s => s !== id)
    setSaved(updated)
    setStartups(prev => prev.filter(s => s.id !== id))
    localStorage.setItem('savedStartups', JSON.stringify(updated))
  }

  return (
    <DashboardLayout navItems={NAV} hubLabel="Investor Hub">
      <div className="max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/investor/dashboard')} className="text-gray-400 hover:text-ink-black transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-ink-black">Saved Startups</h1>
              <p className="text-xs text-gray-400">Startups you've bookmarked for follow-up</p>
            </div>
          </div>
          <button onClick={() => navigate('/investor/directory')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
            style={{ backgroundColor: '#28C3BE' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}>
            Browse Directory
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 text-sm py-16">Loading...</div>
        ) : startups.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-3">No saved startups yet.</p>
            <button onClick={() => navigate('/investor/directory')}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#28C3BE' }}>
              Browse Startups
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {startups.map(s => (
              <div key={s.id} className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center justify-between"
                style={{ borderLeft: '4px solid #28C3BE' }}>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink-black">{s.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{s.sector}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.stage}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{s.description}</p>
                </div>
                <button onClick={() => remove(s.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition ml-4 flex-shrink-0">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

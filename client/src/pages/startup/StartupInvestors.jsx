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

function InvestorModal({ investor, onClose }) {
  if (!investor) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-ink-black text-lg">{investor.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{investor.organizationType || 'Investor'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-ink-black text-xl">&#x2715;</button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Investment Stages</p>
            <div className="flex flex-wrap gap-2">
              {investor.investmentStage?.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#056EDC15', color: '#056EDC' }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Sector Focus</p>
            <div className="flex flex-wrap gap-2">
              {investor.sectorFocus?.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#28C3BE15', color: '#009BAA' }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Geographic Focus</p>
            <div className="flex flex-wrap gap-2">
              {investor.geographicFocus?.map(g => (
                <span key={g} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFC30015', color: '#b38600' }}>{g}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-gray-500">Funding Capacity</span>
            <span className="font-semibold text-ink-black">{investor.fundingCapacity}</span>
          </div>
        </div>
        <div className="p-6 pt-0">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-gray-400 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StartupInvestors() {
  const navigate = useNavigate()
  const [investors, setInvestors] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams({ limit: '20' })
        if (search) params.set('search', search)
        const res  = await fetch(`/api/directory/investors?${params}`)
        const text = await res.text()
        if (!text) throw new Error('No response from server.')
        const data = JSON.parse(text)
        if (!res.ok) throw new Error(data.message)
        setInvestors(data.data?.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    const debounce = setTimeout(load, 300)
    return () => clearTimeout(debounce)
  }, [search])

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
            <h1 className="text-xl font-bold text-ink-black">Investors</h1>
            <p className="text-xs text-gray-400">Browse investors looking for startups like yours</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text" placeholder="Search investors..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-ink-teal bg-white"
            style={{ '--tw-ring-color': '#28C3BE' }}
          />
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

        {loading ? (
          <div className="text-center text-gray-400 text-sm py-16">Loading investors...</div>
        ) : investors.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-16">No investors found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {investors.map(inv => (
              <div key={inv.id}
                className="bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
                style={{ borderLeft: '4px solid #056EDC' }}
                onClick={() => setSelected(inv)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-ink-black text-sm">{inv.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{inv.organizationType || 'Investor'}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#28C3BE15', color: '#009BAA' }}>
                    {inv.fundingCapacity}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {inv.sectorFocus?.slice(0, 3).map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{s}</span>
                  ))}
                  {inv.sectorFocus?.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">+{inv.sectorFocus.length - 3}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">Stages: {inv.investmentStage?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <InvestorModal investor={selected} onClose={() => setSelected(null)} />
    </DashboardLayout>
  )
}

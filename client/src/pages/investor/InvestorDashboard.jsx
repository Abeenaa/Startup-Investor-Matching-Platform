import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { path: '/investor/dashboard', label: 'Dashboard'         },
  { path: '/investor/profile',   label: 'My Profile'        },
  { path: '/investor/directory', label: 'Startup Directory' },
  { path: '/investor/saved',     label: 'Saved Startups'    },
]

// SVG Icons
const ProfileIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const BuildingIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
)
const BookmarkIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
)
const TargetIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
)

// Stat card — same style as startup dashboard
function StatCard({ title, value, sub, subColor, borderColor, icon }) {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col gap-2 shadow-sm"
      style={{ borderLeft: `4px solid ${borderColor}` }}>
      <div className="flex items-start justify-between">
        <p className="text-xs text-gray-400">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-ink-black">{value ?? '—'}</p>
      <p className="text-xs font-medium" style={{ color: subColor }}>{sub}</p>
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow px-3 py-2 text-xs">
      <p className="font-semibold text-ink-black">{label}</p>
      <p style={{ color: '#056EDC' }}>Startups : {payload[0].value}</p>
    </div>
  )
}

// Placeholder chart — new startups added per week
const CHART_DATA = [
  { date: 'Mar 1',  count: 5  },
  { date: 'Mar 8',  count: 12 },
  { date: 'Mar 15', count: 18 },
  { date: 'Mar 22', count: 27 },
  { date: 'Mar 29', count: 35 },
]

export default function InvestorDashboard() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const token     = localStorage.getItem('token')

  const [profile,   setProfile]   = useState(null)
  const [startups,  setStartups]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const saved = JSON.parse(localStorage.getItem('savedStartups') || '[]')

  useEffect(() => {
    const load = async () => {
      try {
        // Load investor profile + recent startups in parallel
        const [profRes, dirRes] = await Promise.all([
          fetch('/api/investors/profile', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/directory/startups?limit=4'),
        ])
        const profData = await profRes.json()
        const dirData  = await dirRes.json()

        if (profRes.ok) setProfile(profData.data)
        if (dirRes.ok)  setStartups(dirData.data?.data || [])
      } catch {
        // silently fail — show what we have
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statusStyle = {
    APPROVED: { bg: '#28C3BE15', color: '#009BAA' },
    PENDING:  { bg: '#FFC30015', color: '#b38600' },
    REJECTED: { bg: '#ff000015', color: '#cc0000' },
  }
  const st = statusStyle[profile?.approvalStatus] || statusStyle.PENDING

  return (
    <DashboardLayout navItems={NAV} hubLabel="Investor Hub">
      <div className="space-y-6 max-w-5xl">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ink-black">
            Welcome back, {profile?.name || user?.email} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {profile?.organizationType || 'Investor'}{profile?.fundingCapacity ? ` · ${profile.fundingCapacity}` : ''}
          </p>
        </div>

        {/* Profile pending banner */}
        {profile?.approvalStatus === 'PENDING' && (
          <div className="bg-[#FFC30015] border border-[#FFC300] rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-sm font-semibold text-ink-black">Profile under review</p>
              <p className="text-xs text-gray-500">Your investor profile is pending admin approval.</p>
            </div>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Profile Status"
            value={profile?.approvalStatus || '—'}
            sub={profile?.approvalStatus === 'APPROVED' ? 'Visible to startups' : 'Awaiting approval'}
            subColor={st.color}
            borderColor={st.color}
            icon={<ProfileIcon color={st.color} />}
          />
          <StatCard
            title="Startups in Directory"
            value={startups.length > 0 ? `${startups.length}+` : '—'}
            sub="Approved startups"
            subColor="#9ca3af"
            borderColor="#056EDC"
            icon={<BuildingIcon color="#056EDC" />}
          />
          <StatCard
            title="Saved Startups"
            value={saved.length}
            sub="In your watchlist"
            subColor="#9ca3af"
            borderColor="#FFC300"
            icon={<BookmarkIcon color="#FFC300" />}
          />
          <StatCard
            title="Sectors Focused"
            value={profile?.sectorFocus?.length ?? '—'}
            sub={profile?.sectorFocus?.slice(0,2).join(', ') || 'Not set'}
            subColor="#9ca3af"
            borderColor="#FF8700"
            icon={<TargetIcon color="#FF8700" />}
          />
        </div>

        {/* Chart + Quick Actions */}
        <div className="grid grid-cols-3 gap-4">

          {/* Chart */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
            <p className="font-semibold text-ink-black text-sm">Startup Growth Trend</p>
            <p className="text-xs text-gray-400 mb-4">New startups joining the platform</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="linear" dataKey="count" stroke="#056EDC" strokeWidth={2}
                  dot={{ r: 4, fill: '#056EDC', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
            <p className="font-semibold text-ink-black text-sm mb-1">Quick Actions</p>
            {[
              { label: 'Update Profile',      path: '/investor/profile'   },
              { label: 'Browse Startups',     path: '/investor/directory' },
              { label: 'View Saved',          path: '/investor/saved'     },
              { label: 'Contact Support',     path: null                  },
            ].map(({ label, path }) => (
              <button key={label}
                onClick={() => path && navigate(path)}
                className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-ink-black hover:border-ink-teal hover:text-ink-teal transition-colors">
                {label}
              </button>
            ))}
            <button
              onClick={() => navigate('/investor/directory')}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-auto transition-colors"
              style={{ backgroundColor: '#28C3BE' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}>
              Discover Startups
            </button>
          </div>
        </div>

        {/* Recent Startups + Investment Focus */}
        <div className="grid grid-cols-3 gap-4">

          {/* Recent startups from directory */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-ink-black text-sm">Recent Startups</p>
                <p className="text-xs text-gray-400">Latest approved startups in the directory</p>
              </div>
              <button onClick={() => navigate('/investor/directory')}
                className="text-xs font-medium" style={{ color: '#28C3BE' }}>
                Browse all →
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : startups.length === 0 ? (
              <p className="text-sm text-gray-400">No startups yet.</p>
            ) : (
              <div className="space-y-3">
                {startups.map(s => (
                  <div key={s.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ink-black">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{s.sector}</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{s.stage}</span>
                      </div>
                    </div>
                    <button onClick={() => navigate('/investor/directory')}
                      className="text-xs font-semibold px-3 py-1 rounded-full transition"
                      style={{ backgroundColor: '#28C3BE15', color: '#009BAA' }}>
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Investment Focus summary */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="font-semibold text-ink-black text-sm mb-4">My Investment Focus</p>
            {!profile ? (
              <p className="text-sm text-gray-400">Profile not set up yet.</p>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Funding Capacity</p>
                  <p className="font-semibold" style={{ color: '#28C3BE' }}>{profile.fundingCapacity || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Investment Stages</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.investmentStage?.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: '#056EDC15', color: '#056EDC' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Sector Focus</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.sectorFocus?.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: '#28C3BE15', color: '#009BAA' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Geographic Focus</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.geographicFocus?.map(g => (
                      <span key={g} className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: '#FFC30015', color: '#b38600' }}>{g}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

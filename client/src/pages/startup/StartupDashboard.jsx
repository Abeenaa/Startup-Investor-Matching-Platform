import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import DashboardLayout from '../../components/DashboardLayout'

const NAV = [
  { path: '/startup/dashboard', label: 'Dashboard'  },
  { path: '/startup/profile',   label: 'My Profile' },
  { path: '/startup/programs',  label: 'Programs'   },
  { path: '/startup/investors', label: 'Investors'  },
  { path: '/startup/resources', label: 'Resources'  },
]

const CHART_DATA = [
  { date: 'Mar 1',  views: 40  },
  { date: 'Mar 8',  views: 55  },
  { date: 'Mar 15', views: 85  },
  { date: 'Mar 22', views: 110 },
  { date: 'Mar 29', views: 140 },
]

const APPLICATIONS = [
  { id: 1, name: 'Seed Accelerator Program', date: '2024-03-20', stage: 'Initial Review',  status: 'In Review', statusColor: '#056EDC' },
  { id: 2, name: 'Growth Fund 2024',         date: '2024-03-15', stage: 'Portfolio Stage', status: 'Approved',  statusColor: '#28C3BE' },
  { id: 3, name: 'Tech Innovation Grant',    date: '2024-03-10', stage: 'Screening',       status: 'Pending',   statusColor: '#FF8700' },
]

// SVG icon paths
const EyeIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const DocIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

const PeopleIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const TrendIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

// Stat card with colored left border
function StatCard({ title, value, sub, subColor, borderColor, icon }) {
  return (
    <div
      className="bg-white rounded-xl p-5 flex flex-col gap-2 shadow-sm"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs text-gray-400">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-ink-black">{value}</p>
      <p className="text-xs font-medium" style={{ color: subColor }}>{sub}</p>
    </div>
  )
}

// Custom chart tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow px-3 py-2 text-xs">
      <p className="font-semibold text-ink-black">{label}</p>
      <p style={{ color: '#28C3BE' }}>Views : {payload[0].value}</p>
    </div>
  )
}

export default function StartupDashboard() {
  return (
    <DashboardLayout navItems={NAV} hubLabel="Startup Hub">
      <div className="space-y-6 max-w-5xl">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ink-black">Welcome back, demo@startup.com</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track your startup progress and opportunities</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            title="Profile Views"
            value="324"
            sub="&#8593; 12% from last week"
            subColor="#28C3BE"
            borderColor="#28C3BE"
            icon={<EyeIcon color="#28C3BE" />}
          />
          <StatCard
            title="Active Applications"
            value="3"
            sub="1 awaiting review"
            subColor="#9ca3af"
            borderColor="#056EDC"
            icon={<DocIcon color="#056EDC" />}
          />
          <StatCard
            title="Investor Connections"
            value="12"
            sub="3 new this week"
            subColor="#9ca3af"
            borderColor="#FFC300"
            icon={<PeopleIcon color="#FFC300" />}
          />
          <StatCard
            title="Available Programs"
            value="8"
            sub="View all programs"
            subColor="#9ca3af"
            borderColor="#28C3BE"
            icon={<TrendIcon color="#28C3BE" />}
          />
        </div>

        {/* Chart + Quick Actions */}
        <div className="grid grid-cols-3 gap-4">

          {/* Chart */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
            <p className="font-semibold text-ink-black text-sm">Profile Views Trend</p>
            <p className="text-xs text-gray-400 mb-4">Last 30 days</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 160]} ticks={[0, 40, 80, 120, 160]} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="linear" dataKey="views" stroke="#28C3BE" strokeWidth={2} dot={{ r: 4, fill: '#28C3BE', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
            <p className="font-semibold text-ink-black text-sm mb-1">Quick Actions</p>
            {['Update Profile', 'Browse Programs', 'View Investors', 'Contact Support'].map((label) => (
              <button
                key={label}
                className="w-full text-left px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-ink-black hover:border-ink-teal hover:text-ink-teal transition-colors"
              >
                {label}
              </button>
            ))}
            <button
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-auto transition-colors"
              style={{ backgroundColor: '#28C3BE' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#009BAA'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#28C3BE'}
            >
              New Application
            </button>
          </div>

        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="font-semibold text-ink-black text-sm">Recent Applications</p>
          <p className="text-xs text-gray-400 mb-4">Track your program applications and status</p>
          <div className="space-y-3">
            {APPLICATIONS.map((app) => (
              <div key={app.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink-black">{app.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{app.date}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      Stage: {app.stage}
                    </span>
                  </div>
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ color: app.statusColor, backgroundColor: app.statusColor + '18' }}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

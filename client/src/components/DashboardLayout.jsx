import { Link, useLocation, useNavigate } from 'react-router-dom'
import InkLogo from './InkLogo'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ children, navItems, hubLabel = 'Startup Hub' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-44 flex-shrink-0 flex flex-col bg-white border-r border-gray-100">

        {/* Logo */}
        <div className="px-5 pt-5 pb-3">
          <InkLogo height={28} />
          <p className="text-xs text-gray-400 mt-1">{hubLabel}</p>
        </div>

        {/* Nav */}
        <div className="px-4 mt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Menu</p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{
                    color:           active ? '#28C3BE' : '#374151',
                    fontWeight:      active ? 600 : 400,
                    borderLeft:      active ? '3px solid #28C3BE' : '3px solid transparent',
                    backgroundColor: active ? '#28C3BE10' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sign Out */}
        <div className="mt-auto px-4 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors px-3 py-2"
          >
            <span>→</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>

    </div>
  )
}

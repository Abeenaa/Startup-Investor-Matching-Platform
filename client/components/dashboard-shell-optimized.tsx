'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { useEffect, useState, memo, useCallback } from 'react'
import { getSession } from '@/lib/session'
import { logout } from '@/lib/api'
import { DashboardLoading } from './dashboard-loading'

type NavItem = { href: string; label: string; icon?: React.ReactNode }

type DashboardShellProps = {
  title: string
  description: string
  navItems: NavItem[]
  portalLabel: string
  allowedRoles?: string[]
  children: React.ReactNode
}

// Memoized sidebar component for performance
const Sidebar = memo(({ 
  sidebarOpen, 
  setSidebarOpen, 
  portalLabel, 
  navItems, 
  pathname, 
  userEmail, 
  handleLogout 
}: {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  portalLabel: string
  navItems: NavItem[]
  pathname: string
  userEmail: string
  handleLogout: () => void
}) => (
  <aside
    className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out md:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    {/* Logo */}
    <div className="flex items-center gap-3 border-b border-border px-6 py-5">
      <Image src="/logo.svg" alt="Innobiz-K" width={31} height={18} className="h-6 w-auto" priority />
      <div>
        <p className="text-xs font-bold tracking-widest text-foreground">INNOBIZ-K</p>
        <p className="text-[10px] font-medium tracking-wider text-muted-foreground">{portalLabel}</p>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto px-6 py-4">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">MENU</p>
      <div className="space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center gap-2.5 rounded px-4 py-2.5 text-xs font-medium transition-all ${
                active
                  ? 'bg-primary/5 text-primary border-l-2 border-l-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.icon && <span className="opacity-70">{item.icon}</span>}
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>

    {/* User + Logout */}
    <div className="border-t border-border p-6">
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded px-4 py-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/5"
      >
        <LogOut size={14} />
        Sign Out
      </button>
    </div>
  </aside>
))

Sidebar.displayName = 'Sidebar'

export function DashboardShellOptimized({
  title,
  description,
  navItems,
  portalLabel,
  allowedRoles,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check session immediately without delay
    const session = getSession()
    
    if (!session) {
      console.log('No session found, redirecting to login')
      window.location.href = '/login'
      return
    }

    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
      console.log('Role not allowed:', session.user.role, 'Expected:', allowedRoles)
      window.location.href = '/login'
      return
    }

    // Session is valid, show dashboard
    setUserEmail(session.user.email)
    setIsLoading(false)
  }, [allowedRoles])

  const handleLogout = useCallback(() => {
    logout()
    window.location.href = '/login'
  }, [])

  if (isLoading) {
    return <DashboardLoading />
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        portalLabel={portalLabel}
        navItems={navItems}
        pathname={pathname}
        userEmail={userEmail}
        handleLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}


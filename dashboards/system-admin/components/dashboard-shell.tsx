'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getSession } from '@/lib/session'
import { logout } from '@/lib/api'

type NavItem = { href: string; label: string; icon?: React.ReactNode }

type DashboardShellProps = {
  title: string
  description: string
  navItems: NavItem[]
  portalLabel?: string
  children: React.ReactNode
}

export function DashboardShell({
  title,
  description,
  navItems,
  portalLabel = 'SYSTEM ADMIN',
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const session = getSession()
    if (!session || !['SYSTEM_ADMIN'].includes(session.user.role)) { router.push('/login'); return }
    setUserEmail(session.user.email)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/login')
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
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Image src="/logo.svg" alt="Innobiz-K" width={20} height={12} className="h-5 w-auto" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-foreground">INNOBIZ-K</p>
            <p className="text-[10px] font-medium tracking-wider text-muted-foreground">{portalLabel}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Navigation
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon && <span className="opacity-70">{item.icon}</span>}
                    {item.label}
                  </div>
                  {active && <ChevronRight size={14} className="opacity-60" />}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User + Logout */}
        <div className="border-t border-border p-3">
          <div className="mb-2 rounded-xl bg-muted/60 px-3 py-2.5">
            <p className="truncate text-xs font-medium text-foreground">{userEmail}</p>
            <p className="text-[10px] text-muted-foreground">Signed in</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/8"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3.5 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">{title}</h1>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right">
              <p className="text-xs font-medium text-foreground">{userEmail.split('@')[0]}</p>
              <p className="text-[10px] text-muted-foreground">{userEmail}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {userEmail.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

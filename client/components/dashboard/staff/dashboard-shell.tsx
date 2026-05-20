'use client'

import { DashboardShellOptimized } from '@/components/dashboard-shell-optimized'

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
  portalLabel = 'Admin Panel',
  children,
}: DashboardShellProps) {
  return (
    <DashboardShellOptimized
      title={title}
      description={description}
      navItems={navItems}
      portalLabel={portalLabel}
      allowedRoles={['STAFF_ADMIN']}
    >
      {children}
    </DashboardShellOptimized>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Database, Users, FileText, Star, Layers3 } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { getDashboard, type SystemDashboardData } from '@/lib/api'

const navItems = [
  { href: '/dashboard/system-admin', label: 'Dashboard' },
  { href: '/dashboard/system-admin/servers', label: 'Servers' },
  { href: '/dashboard/system-admin/database', label: 'Database' },
  { href: '/dashboard/system-admin/security', label: 'Security' },
  { href: '/dashboard/system-admin/settings', label: 'Settings' },
]

export default function DatabasePage() {
  const [data, setData] = useState<SystemDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(setData).catch(() => null).finally(() => setLoading(false))
  }, [])

  const tables = data ? [
    { table: 'users', rows: data.users.total, icon: Users, description: 'All registered platform users' },
    { table: 'startups', rows: data.profiles.startups.total, icon: Star, description: 'Startup profiles (approved + pending)' },
    { table: 'investors', rows: data.profiles.investors.total, icon: Database, description: 'Investor profiles' },
    { table: 'applications', rows: data.systemHealth.totalApplications, icon: FileText, description: 'Program applications submitted' },
    { table: 'evaluations', rows: data.systemHealth.totalEvaluations, icon: Star, description: 'Reviewer evaluations completed' },
    { table: 'programs', rows: data.systemHealth.totalPrograms, icon: Layers3, description: 'Funding and support programs' },
  ] : []

  return (
    <DashboardShell title="Database" description="Table-level data volume from the live database" navItems={navItems} portalLabel="SYSTEM ADMIN">
      {loading ? (
        <div className="space-y-3">{[...Array(6)].map((_, i: number) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-1 flex items-center gap-2">
              <Database size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">innobiz_k — Table Overview</h2>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">Live row counts from the PostgreSQL database via Prisma ORM</p>
            <div className="space-y-2">
              {tables.map(({ table, rows, icon: Icon, description }) => (
                <div key={table} className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/40">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Icon size={14} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-mono text-sm font-semibold text-foreground">{table}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{rows.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">rows</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Profile Approval Status</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {data && [
                { label: 'Startups Approved', value: data.profiles.startups.approved, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                { label: 'Startups Pending', value: data.profiles.startups.pending, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
                { label: 'Investors Approved', value: data.profiles.investors.approved, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                { label: 'Investors Pending', value: data.profiles.investors.pending, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={`rounded-xl border p-3 text-center ${bg}`}>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

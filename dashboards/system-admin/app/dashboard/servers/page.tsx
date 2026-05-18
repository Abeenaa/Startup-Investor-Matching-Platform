'use client'

import { useEffect, useState } from 'react'
import { Activity, CheckCircle, Clock, Database, Zap } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { getDashboard, type SystemDashboardData } from '@/lib/api'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/servers', label: 'Servers' },
  { href: '/dashboard/database', label: 'Database' },
  { href: '/dashboard/security', label: 'Security' },
  { href: '/dashboard/settings', label: 'Settings' },
]

export default function ServersPage() {
  const [data, setData] = useState<SystemDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(setData).catch(() => null).finally(() => setLoading(false))
  }, [])

  const metrics = data ? [
    { label: 'Total Applications Processed', value: data.systemHealth.totalApplications, icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Evaluations Submitted', value: data.systemHealth.totalEvaluations, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Programs', value: data.systemHealth.totalPrograms, icon: Database, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Avg. Response Time (days)', value: data.systemHealth.averageResponseTime, icon: Clock, color: 'text-accent-foreground', bg: 'bg-accent/20' },
  ] : []

  return (
    <DashboardShell title="Servers" description="Platform throughput and operational metrics" navItems={navItems} portalLabel="SYSTEM ADMIN">
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                  <Icon size={18} className={color} />
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Activity size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Service Status</h2>
            </div>
            <div className="space-y-3">
              {[
                ['API Server', 'http://localhost:5000', 'Operational'],
                ['Database', 'PostgreSQL (innobiz_k)', 'Operational'],
                ['Authentication', 'JWT / Refresh Tokens', 'Operational'],
                ['File Storage', 'Supabase Storage', 'Operational'],
              ].map(([service, detail, status]) => (
                <div key={service} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{service}</p>
                    <p className="text-xs text-muted-foreground">{detail}</p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />{status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  )
}

'use client'

import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/submissions', label: 'My Submissions' },
  { href: '/dashboard/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/conflicts', label: 'Conflicts' },
  { href: '/dashboard/help', label: 'Help' },
]

export default function ConflictsPage() {
  return (
    <DashboardShell title="Conflicts" description="Reviewer conflict reminders and declaration rules" navItems={navItems}>
      <Card className="space-y-4 p-6">
        {[
          ['Direct financial interest', 'Do not review if you have an ownership or investment relationship.', 'High'],
          ['Personal relationship', 'Escalate if you know the founders personally or professionally.', 'Medium'],
          ['Recent advisory work', 'Step back if you advised the startup in the recent review window.', 'High'],
        ].map(([title, text, level]) => (
          <div key={title} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
              <Badge className={level === 'High' ? 'border border-red-200 bg-red-50 text-red-700' : 'border border-yellow-200 bg-yellow-50 text-yellow-700'}>{level}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </Card>
    </DashboardShell>
  )
}

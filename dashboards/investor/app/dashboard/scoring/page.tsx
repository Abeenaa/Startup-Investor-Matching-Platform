'use client'

import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/submissions', label: 'My Submissions' },
  { href: '/dashboard/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/conflicts', label: 'Conflicts' },
  { href: '/dashboard/help', label: 'Help' },
]

export default function ScoringPage() {
  return (
    <DashboardShell title="Scoring Guide" description="Reference rubric for reviewer decisions" navItems={navItems}>
      <Card className="space-y-4 p-6">
        {[
          ['Innovation & Product', 'Check originality, technical realism, and product clarity.'],
          ['Market Strength', 'Assess demand, customer segment focus, and competitive position.'],
          ['Team Execution', 'Review founder readiness, traction, and execution evidence.'],
          ['Business Viability', 'Look at revenue logic, growth potential, and sustainability.'],
          ['Impact & Alignment', 'Confirm fit with program goals and wider ecosystem value.'],
        ].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </Card>
    </DashboardShell>
  )
}

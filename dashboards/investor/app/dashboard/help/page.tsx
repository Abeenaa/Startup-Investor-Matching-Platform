'use client'

import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/submissions', label: 'My Submissions' },
  { href: '/dashboard/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/conflicts', label: 'Conflicts' },
  { href: '/dashboard/help', label: 'Help' },
]

export default function HelpPage() {
  return (
    <DashboardShell title="Help" description="Support options for reviewer work" navItems={navItems}>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground">Need backend access help?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If login fails here, first verify your reviewer account exists in the backend seed data or admin-created users.
          </p>
          <Button className="mt-4 text-xs">Check account with staff admin</Button>
        </Card>
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground">Need a scoring reminder?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the scoring guide page before submitting evaluations so your notes stay aligned with the program rubric.
          </p>
          <Button variant="outline" className="mt-4 text-xs">Open scoring guide</Button>
        </Card>
      </div>
    </DashboardShell>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAssignments, type ReviewerAssignmentsResponse } from '@/lib/api'

const navItems = [
  { href: '/dashboard/investor', label: 'Dashboard' },
  { href: '/dashboard/investor/submissions', label: 'My Submissions' },
  { href: '/dashboard/investor/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/investor/conflicts', label: 'Conflicts' },
  { href: '/dashboard/investor/help', label: 'Help' },
]

export default function SubmissionsPage() {
  const [assignments, setAssignments] = useState<ReviewerAssignmentsResponse['data']>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAssignments()
      .then((response) => setAssignments(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load submissions'))
  }, [])

  return (
    <DashboardShell title="My Submissions" description="Completed reviewer assignments" navItems={navItems}>
      {error ? <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div> : null}
      <div className="space-y-3">
        {assignments.length ? assignments.map((submission: any) => (
          <Card key={submission.id} className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{submission.startupName}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{submission.programName}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="text-sm font-semibold text-foreground">{submission.score ?? '-'}</p>
                </div>
                <Badge className="border border-green-200 bg-green-50 text-green-700">{submission.recommendation?.replaceAll('_', ' ') || 'Completed'}</Badge>
              </div>
            </div>
          </Card>
        )) : <Card className="p-6 text-sm text-muted-foreground">No completed submissions found for this reviewer yet.</Card>}
      </div>
    </DashboardShell>
  )
}

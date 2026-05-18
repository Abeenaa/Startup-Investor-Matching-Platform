'use client'

import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/submissions', label: 'My Submissions' },
  { href: '/dashboard/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/conflicts', label: 'Conflicts' },
  { href: '/dashboard/help', label: 'Help' },
  { href: '/dashboard/settings', label: 'Settings' },
]

const conflicts = [
  {
    title: 'Direct Financial Interest',
    level: 'High',
    levelColor: 'border-red-200 bg-red-50 text-red-700',
    icon: AlertTriangle,
    iconColor: 'bg-red-100 text-red-600',
    description: 'You have an ownership stake, investment, or financial relationship with the startup or its founders.',
    action: 'Immediately declare and recuse yourself. Do not access the application.',
  },
  {
    title: 'Personal or Family Relationship',
    level: 'High',
    levelColor: 'border-red-200 bg-red-50 text-red-700',
    icon: AlertTriangle,
    iconColor: 'bg-red-100 text-red-600',
    description: 'You have a personal, romantic, or family relationship with any founder or key team member.',
    action: 'Declare the conflict immediately. The staff admin will reassign the application.',
  },
  {
    title: 'Recent Advisory or Employment',
    level: 'High',
    levelColor: 'border-red-200 bg-red-50 text-red-700',
    icon: AlertTriangle,
    iconColor: 'bg-red-100 text-red-600',
    description: 'You have advised, consulted for, or been employed by the startup within the past 24 months.',
    action: 'Declare and recuse. This applies even if the relationship has ended.',
  },
  {
    title: 'Professional Relationship',
    level: 'Medium',
    levelColor: 'border-orange-200 bg-orange-50 text-orange-700',
    icon: Info,
    iconColor: 'bg-orange-100 text-orange-600',
    description: 'You have a professional relationship (colleague, collaborator, competitor) that could bias your judgment.',
    action: 'Use your judgment. If in doubt, declare it and let the staff admin decide.',
  },
  {
    title: 'Competitive Interest',
    level: 'Medium',
    levelColor: 'border-orange-200 bg-orange-50 text-orange-700',
    icon: Info,
    iconColor: 'bg-orange-100 text-orange-600',
    description: 'You or your organization competes directly with the startup in the same market.',
    action: 'Declare the potential conflict. The staff admin will assess whether reassignment is needed.',
  },
]

export default function ConflictsPage() {
  return (
    <DashboardShell title="Conflict of Interest" description="Policy and declaration guidelines for reviewers" navItems={navItems} portalLabel="REVIEWER PORTAL">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Policy summary */}
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <CheckCircle size={16} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">Your responsibility as a reviewer</p>
            <p className="mt-1 text-sm text-muted-foreground leading-6">
              You are required to declare any conflict of interest <strong className="text-foreground">before</strong> reviewing an application. Failure to declare a conflict may result in removal from the reviewer program. When in doubt, declare it.
            </p>
          </div>
        </div>

        {/* Conflict types */}
        <div className="space-y-3">
          {conflicts.map(({ title, level, levelColor, icon: Icon, iconColor, description, action }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${levelColor}`}>{level}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
                  <div className="mt-3 rounded-xl bg-muted/60 px-3 py-2.5">
                    <p className="text-xs font-medium text-foreground">Required action:</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How to declare */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">How to Declare a Conflict</h2>
          <ol className="space-y-2">
            {[
              'Do not open or read the application in detail.',
              'Contact your staff administrator immediately at staff.admin@innobiz.et.',
              'Provide the application ID and the nature of the conflict.',
              'The staff admin will reassign the application to another reviewer.',
              'Your declaration will be recorded in the system for audit purposes.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

      </div>
    </DashboardShell>
  )
}

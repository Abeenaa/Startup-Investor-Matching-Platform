'use client'

import { DashboardShell } from '@/components/dashboard-shell'
import { Star, TrendingUp, Users, Lightbulb, Target, Globe } from 'lucide-react'

const navItems = [
  { href: '/dashboard/reviewer', label: 'Dashboard' },
  { href: '/dashboard/reviewer/submissions', label: 'My Submissions' },
  { href: '/dashboard/reviewer/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/reviewer/conflicts', label: 'Conflicts' },
  { href: '/dashboard/reviewer/help', label: 'Help' },
  { href: '/dashboard/reviewer/settings', label: 'Settings' },
]

const criteria = [
  {
    icon: Lightbulb,
    title: 'Innovation & Originality',
    weight: '25%',
    color: 'bg-primary/10 text-primary',
    description: 'How novel and differentiated is the solution? Does it address the problem in a meaningfully new way?',
    indicators: ['Unique approach vs. existing solutions', 'Technical or business model innovation', 'Intellectual property or defensibility'],
  },
  {
    icon: Target,
    title: 'Feasibility & Execution',
    weight: '25%',
    color: 'bg-secondary/10 text-secondary',
    description: 'Is the solution technically and operationally achievable? Does the team have a realistic plan?',
    indicators: ['Technical viability', 'Realistic timeline and milestones', 'Resource requirements vs. availability'],
  },
  {
    icon: TrendingUp,
    title: 'Market Potential',
    weight: '25%',
    color: 'bg-green-100 text-green-700',
    description: 'Is there a real, sizeable market? Does the startup understand its customers and competitive landscape?',
    indicators: ['Market size and growth trajectory', 'Customer validation or traction', 'Competitive positioning'],
  },
  {
    icon: Users,
    title: 'Team Strength',
    weight: '15%',
    color: 'bg-orange-100 text-orange-700',
    description: 'Does the founding team have the skills, experience, and commitment to execute?',
    indicators: ['Relevant domain expertise', 'Complementary skill sets', 'Track record and commitment'],
  },
  {
    icon: Globe,
    title: 'Impact & Alignment',
    weight: '10%',
    color: 'bg-accent/20 text-foreground',
    description: 'Does the startup align with the program\'s goals and contribute to the broader ecosystem?',
    indicators: ['Alignment with program objectives', 'Social or economic impact potential', 'Scalability beyond initial market'],
  },
]

const scoreGuide = [
  { range: '9–10', label: 'Exceptional', desc: 'Outstanding in all dimensions. Highly recommend.' },
  { range: '7–8', label: 'Strong', desc: 'Above average with clear strengths. Recommend.' },
  { range: '5–6', label: 'Average', desc: 'Meets basic criteria but needs improvement.' },
  { range: '3–4', label: 'Weak', desc: 'Significant gaps. Does not meet program standards.' },
  { range: '0–2', label: 'Poor', desc: 'Fails to meet minimum criteria. Reject.' },
]

export default function ScoringPage() {
  return (
    <DashboardShell title="Scoring Guide" description="Evaluation criteria and rubric for reviewers" navItems={navItems} portalLabel="REVIEWER PORTAL">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Overview */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Star size={15} className="text-accent" fill="currentColor" />
            <h2 className="text-sm font-semibold text-foreground">Scoring Overview</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-6">
            All applications are scored on a <strong className="text-foreground">0–10 scale</strong>. Your score is averaged with other reviewers' scores to produce a final aggregate. Be objective, consistent, and base your evaluation on the criteria below.
          </p>
        </div>

        {/* Criteria */}
        <div className="space-y-3">
          {criteria.map(({ icon: Icon, title, weight, color, description, indicators }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">{weight}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-5">{description}</p>
                  <ul className="mt-3 space-y-1">
                    {indicators.map(ind => (
                      <li key={ind} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground shrink-0" />{ind}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Score reference */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Score Reference</h2>
          </div>
          <div className="divide-y divide-border">
            {scoreGuide.map(({ range, label, desc }) => (
              <div key={range} className="flex items-center gap-4 px-5 py-3">
                <span className="w-12 shrink-0 text-center font-mono text-sm font-bold text-foreground">{range}</span>
                <span className="w-28 shrink-0 text-sm font-semibold text-foreground">{label}</span>
                <span className="text-sm text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardShell>
  )
}

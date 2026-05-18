'use client'

import { HelpCircle, BookOpen, AlertTriangle, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { useState } from 'react'
import Link from 'next/link'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/submissions', label: 'My Submissions' },
  { href: '/dashboard/scoring', label: 'Scoring Guide' },
  { href: '/dashboard/conflicts', label: 'Conflicts' },
  { href: '/dashboard/help', label: 'Help' },
  { href: '/dashboard/settings', label: 'Settings' },
]

const faqs = [
  {
    q: 'How do I get assigned to applications?',
    a: 'A staff admin assigns you to applications based on your expertise and availability. You will see them appear in your Dashboard under "Pending Assignments".',
  },
  {
    q: 'What happens after I submit an evaluation?',
    a: 'Your score and feedback are recorded and aggregated with other reviewers. The staff admin reviews all evaluations before making a final decision on the application.',
  },
  {
    q: 'Can I edit an evaluation after submitting?',
    a: 'Yes, you can update your evaluation as long as the application is still in the UNDER_REVIEW status. Once a final decision is made, evaluations are locked.',
  },
  {
    q: 'What should I do if I have a conflict of interest?',
    a: 'Immediately declare the conflict on the Conflicts page. Do not evaluate the application. The staff admin will reassign it to another reviewer.',
  },
  {
    q: 'How is the score calculated?',
    a: 'Scores are on a 0–10 scale. The system averages all reviewer scores for each application. See the Scoring Guide for detailed criteria.',
  },
]

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <DashboardShell title="Help & Support" description="Guidance for reviewers on the Innobiz-K platform" navItems={navItems} portalLabel="REVIEWER PORTAL">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: BookOpen, label: 'Scoring Guide', desc: 'Evaluation criteria and rubric', href: '/dashboard/scoring', color: 'bg-primary/10 text-primary' },
            { icon: AlertTriangle, label: 'Conflict Policy', desc: 'When and how to declare conflicts', href: '/dashboard/conflicts', color: 'bg-orange-100 text-orange-600' },
            { icon: Mail, label: 'Contact Admin', desc: 'Reach your staff administrator', href: 'mailto:staff.admin@innobiz.et', color: 'bg-secondary/10 text-secondary' },
          ].map(({ icon: Icon, label, desc, href, color }) => (
            <Link key={label} href={href} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* FAQs */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <HelpCircle size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Frequently Asked Questions</h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/40"
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={15} className="shrink-0 text-muted-foreground" /> : <ChevronDown size={15} className="shrink-0 text-muted-foreground" />}
                </button>
                {openFaq === i && (
                  <div className="border-t border-border bg-muted/30 px-5 py-4">
                    <p className="text-sm leading-6 text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Still need help?</h2>
          <p className="text-sm text-muted-foreground">Contact your staff administrator at <a href="mailto:staff.admin@innobiz.et" className="font-medium text-primary hover:underline">staff.admin@innobiz.et</a> or reach out through the platform's internal messaging system.</p>
        </div>

      </div>
    </DashboardShell>
  )
}

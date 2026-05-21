'use client'

import { Calendar, ArrowRight } from 'lucide-react'

const programs = [
  {
    name: 'Seed Accelerator Program',
    type: 'ACCELERATION',
    description: 'A 3-month intensive program for early-stage startups ready to scale. Includes mentorship, funding access, and workspace.',
    eligibility: 'Early-stage startups with MVP',
    deadline: '2026-07-31',
    badge: 'Open',
    badgeColor: 'border-green-200 bg-green-50 text-green-700',
  },
  {
    name: 'Women Founders Fund',
    type: 'FUNDING',
    description: 'Dedicated funding initiative supporting women-led startups across all sectors in Ethiopia.',
    eligibility: 'Women-led startups at any stage',
    deadline: '2026-08-15',
    badge: 'Open',
    badgeColor: 'border-green-200 bg-green-50 text-green-700',
  },
  {
    name: 'AgriTech Innovation Challenge',
    type: 'COMPETITION',
    description: 'A national competition for startups solving agricultural challenges with technology.',
    eligibility: 'AgriTech startups',
    deadline: '2026-09-01',
    badge: 'Open',
    badgeColor: 'border-green-200 bg-green-50 text-green-700',
  },
  {
    name: 'Digital Health Incubator',
    type: 'INCUBATION',
    description: '6-month incubation program for HealthTech startups with access to clinical networks and funding.',
    eligibility: 'HealthTech startups',
    deadline: '2026-06-30',
    badge: 'Closing Soon',
    badgeColor: 'border-orange-200 bg-orange-50 text-orange-700',
  },
]

export default function Programs() {
  return (
    <section id="programs" className="innobiz-shell max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
            Programs
          </span>
          <h2 className="innobiz-title mt-5 text-4xl font-bold tracking-[-0.05em] text-foreground">
            Active funding and support programs.
          </h2>
        </div>
        <a href="/signup" className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-xs font-medium text-foreground transition hover:bg-muted">
          View All Programs <ArrowRight size={14} />
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {programs.map(p => (
          <div key={p.name} className="group rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-primary/20">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="innobiz-title text-base font-semibold text-foreground">{p.name}</h3>
                <span className="mt-1 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{p.type}</span>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${p.badgeColor}`}>{p.badge}</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{p.description}</p>
            <p className="mt-3 text-xs text-muted-foreground"><span className="font-medium text-foreground">Eligibility:</span> {p.eligibility}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>Deadline: {new Date(p.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

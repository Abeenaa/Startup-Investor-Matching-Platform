'use client'

import { ArrowRight, TrendingUp } from 'lucide-react'

const investors = [
  {
    name: 'Nile Ventures',
    type: 'Venture Capital',
    focus: 'FinTech, SaaS',
    stages: 'Seed, Series A',
    geography: 'Ethiopia, East Africa',
    range: '$100K – $2M',
  },
  {
    name: 'Addis Angel Network',
    type: 'Angel Network',
    focus: 'AgriTech, HealthTech',
    stages: 'Idea, Early Stage',
    geography: 'Ethiopia',
    range: '$10K – $150K',
  },
  {
    name: 'MInT Innovation Fund',
    type: 'Government Fund',
    focus: 'All Sectors',
    stages: 'Early Stage, Seed',
    geography: 'Ethiopia',
    range: '$50K – $500K',
  },
  {
    name: 'East Africa Growth Capital',
    type: 'Private Equity',
    focus: 'CleanTech, Logistics',
    stages: 'Growth, Expansion',
    geography: 'East Africa',
    range: '$500K – $5M',
  },
]

export default function Investors() {
  return (
    <section id="investors" className="innobiz-shell max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
            Investors
          </span>
          <h2 className="innobiz-title mt-5 text-4xl font-bold tracking-[-0.05em] text-foreground">
            Capital looking for the right opportunity.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Investors across venture capital, angel networks, and government funds actively seeking Ethiopian startups.
          </p>
        </div>
        <a href="/signup" className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-xs font-medium text-foreground transition hover:bg-muted">
          Join as Investor <ArrowRight size={14} />
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {investors.map(inv => (
          <div key={inv.name} className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-secondary/20">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                <TrendingUp size={16} />
              </div>
              <div>
                <h3 className="innobiz-title text-base font-semibold text-foreground">{inv.name}</h3>
                <span className="text-xs text-muted-foreground">{inv.type}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Focus', inv.focus],
                ['Stages', inv.stages],
                ['Geography', inv.geography],
                ['Ticket Size', inv.range],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-0.5 text-xs font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

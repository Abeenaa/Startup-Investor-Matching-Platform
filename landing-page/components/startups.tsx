'use client'

import { ArrowRight, Globe } from 'lucide-react'

const startups = [
  { name: 'Blue Nile Labs', sector: 'FinTech', stage: 'Seed', region: 'Addis Ababa', description: 'Mobile-first financial services platform enabling micro-lending and savings for underbanked communities.' },
  { name: 'AgriNova Ethiopia', sector: 'AgriTech', stage: 'Early Stage', region: 'Oromia', description: 'AI-powered crop monitoring and market linkage platform connecting smallholder farmers to buyers.' },
  { name: 'Ethio Health Grid', sector: 'HealthTech', stage: 'Seed', region: 'Addis Ababa', description: 'Telemedicine and health records platform making quality healthcare accessible in rural Ethiopia.' },
  { name: 'Gebeya Cloud', sector: 'SaaS', stage: 'Growth', region: 'Addis Ababa', description: 'Cloud-based ERP solution tailored for Ethiopian SMEs with local compliance and language support.' },
  { name: 'Solar Circle', sector: 'CleanTech', stage: 'Early Stage', region: 'SNNPR', description: 'Distributed solar energy solutions for off-grid communities with pay-as-you-go financing.' },
  { name: 'FarmLink', sector: 'AgriTech', stage: 'Idea', region: 'Amhara', description: 'Digital marketplace connecting farmers directly with urban consumers, eliminating middlemen.' },
]

const sectorColors: Record<string, string> = {
  FinTech: 'border-blue-200 bg-blue-50 text-blue-700',
  AgriTech: 'border-green-200 bg-green-50 text-green-700',
  HealthTech: 'border-red-200 bg-red-50 text-red-700',
  SaaS: 'border-purple-200 bg-purple-50 text-purple-700',
  CleanTech: 'border-teal-200 bg-teal-50 text-teal-700',
  EdTech: 'border-orange-200 bg-orange-50 text-orange-700',
}

export default function Startups() {
  return (
    <section id="startups" className="innobiz-shell py-24">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
            Startups
          </span>
          <h2 className="innobiz-title mt-5 text-4xl font-bold tracking-[-0.05em] text-foreground">
            Meet Ethiopia's most promising founders.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
            Verified startups building solutions across every sector of the Ethiopian economy.
          </p>
        </div>
        <a href="/signup" className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-white px-5 py-2.5 text-xs font-medium text-foreground transition hover:bg-muted">
          Browse Directory <ArrowRight size={14} />
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {startups.map(s => (
          <div key={s.name} className="group rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-primary/20">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="innobiz-title text-base font-semibold text-foreground">{s.name}</h3>
              <Globe size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
            </div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${sectorColors[s.sector] || 'border-border bg-muted text-muted-foreground'}`}>{s.sector}</span>
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{s.stage}</span>
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{s.region}</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

'use client'

import { ArrowUpRight, Compass, Globe2, Lightbulb, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const pillars = [
  {
    icon: Lightbulb,
    title: 'About Innobiz-K',
    description:
      "Innobiz-K is designed as a trusted digital meeting ground for Ethiopia's innovators, investors, and support programs. We bring visibility, structure, and momentum to the ecosystem.",
  },
  {
    icon: Compass,
    title: 'Mission',
    description:
      'Enable founders to move faster, help investors discover stronger opportunities, and give ecosystem operators a more transparent way to manage growth.',
  },
  {
    icon: Globe2,
    title: 'Vision',
    description:
      "Build a nationally visible innovation infrastructure where promising ideas don't get lost, and every serious player can connect with the right next step.",
  },
  {
    icon: ShieldCheck,
    title: 'What We Stand For',
    description:
      'Credibility, fair access, measurable progress, and a cleaner operating system for the startup ecosystem.',
  },
]

const highlights = [
  'Structured startup and investor discovery',
  'Transparent program and evaluation workflows',
  'Role-based dashboards for reviewers and admins',
  'A modern digital front door for Ethiopia innovation',
]

export default function About() {
  return (
    <section id="about" className="innobiz-shell py-24">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="innobiz-panel overflow-hidden p-8 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              About Us
            </span>
            <h2 className="innobiz-title mt-6 text-4xl font-bold tracking-[-0.05em] text-foreground sm:text-5xl">
              Building a sharper, more connected innovation ecosystem for Ethiopia.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Innobiz-K helps the right people find each other sooner. Startups get clearer exposure, investors get better discovery tools, and ecosystem teams get a more dependable workflow to manage applications, programs, and decisions.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-white/70 px-4 py-4">
                <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-primary" />
                <p className="text-sm text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <Card key={pillar.title} className="rounded-[1.5rem] border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 text-primary">
                    <Icon size={20} />
                  </div>
                  <CardTitle className="innobiz-title text-xl">{pillar.title}</CardTitle>
                  <CardDescription className="text-sm leading-6">{pillar.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

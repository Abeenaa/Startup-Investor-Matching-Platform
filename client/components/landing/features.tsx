'use client'

import { Users, Zap, Target, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Connect & Discover',
    description: 'Find relevant startups and investors based on sector, stage, and investment focus.',
    color: 'from-primary/20'
  },
  {
    icon: Zap,
    title: 'Streamlined Evaluation',
    description: 'Transparent application and evaluation workflows with structured scoring mechanisms.',
    color: 'from-secondary/20'
  },
  {
    icon: Target,
    title: 'Program Management',
    description: 'Centralized ecosystem programs with clear criteria and traceable decisions.',
    color: 'from-accent/20'
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor milestones, KPIs, and long-term impact of funding initiatives.',
    color: 'from-primary/20'
  },
]

export default function Features() {
  return (
    <section id="platform" className="innobiz-shell max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <div className="mb-16 text-center">
        <span className="rounded-full border border-secondary/20 bg-secondary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
          Platform Capabilities
        </span>
        <h2 className="innobiz-title mt-6 text-4xl font-bold tracking-[-0.05em] text-foreground">
          Built to make ecosystem work
          <span className="block">more visible, fair, and efficient.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Designed to support the complete startup lifecycle from discovery to growth.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="group rounded-[1.75rem] border border-white/70 bg-white/80 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
            >
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} to-transparent transition-transform group-hover:scale-110`}>
                <Icon size={18} className="text-primary" />
              </div>
              <h3 className="innobiz-title mb-3 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  );
}

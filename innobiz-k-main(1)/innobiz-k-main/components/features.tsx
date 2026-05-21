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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-light text-foreground mb-4">
          Core Platform Capabilities
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Designed to support the complete startup lifecycle from discovery to growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="group border border-border rounded-sm p-6 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className={`w-10 h-10 rounded-sm bg-gradient-to-br ${feature.color} to-transparent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

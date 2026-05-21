'use client'

import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-border">
      <div className="relative border border-border rounded-sm p-12 sm:p-16 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-light text-foreground mb-4">
            Ready to join the ecosystem?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg">
            Whether you're a startup seeking funding, an investor discovering opportunities, or a program administrator, find your place in Ethiopia's innovation movement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-sm transition-colors flex items-center justify-center gap-2">
              Create Account
              <ArrowRight size={14} />
            </button>
            <button className="px-6 py-3 text-xs font-medium text-foreground border border-border hover:bg-muted rounded-sm transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

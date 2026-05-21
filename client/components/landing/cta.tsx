'use client'

import { ArrowRight, Rocket, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section id="join" className="innobiz-shell py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-12 sm:p-16">
          <div className="absolute inset-0 innobiz-grid opacity-40" />
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <h2 className="innobiz-title text-4xl font-bold tracking-[-0.05em] text-foreground">
                Ready to join the ecosystem?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
                Whether you're a startup seeking funding, an investor discovering opportunities, or a program administrator — find your place in Ethiopia's innovation movement.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Rocket size={20} />
                </div>
                <h3 className="innobiz-title mb-2 text-base font-semibold">I'm a Startup</h3>
                <p className="mb-4 text-xs leading-5 text-muted-foreground">Create your profile, apply to programs, and get discovered by investors.</p>
                <a href="http://localhost:3005" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground transition hover:bg-primary/90">
                  Startup Portal <ArrowRight size={12} />
                </a>
              </div>

              <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <TrendingUp size={20} />
                </div>
                <h3 className="innobiz-title mb-2 text-base font-semibold">I'm an Investor</h3>
                <p className="mb-4 text-xs leading-5 text-muted-foreground">Discover verified startups, get match recommendations, and manage your pipeline.</p>
                <a href="http://localhost:3004" className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-xs font-medium text-secondary-foreground transition hover:bg-secondary/90">
                  Investor Portal <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

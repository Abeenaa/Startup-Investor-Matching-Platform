'use client';

import { cn } from '@/lib/utils';

export default function WhyInnobizK() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Innobiz-K?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm border border-white/60 hover:bg-white/60 transition-all">
            <h3 className="text-xl font-semibold mb-4">Trusted Platform</h3>
            <p className="text-muted-foreground">
              Connecting Ethiopian startups with investors, mentors, and opportunities since 2020.
            </p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm border border-white/60 hover:bg-white/60 transition-all">
            <h3 className="text-xl font-semibold mb-4">Comprehensive Resources</h3>
            <p className="text-muted-foreground">
              Access to funding, training, mentorship, and market insights all in one place.
            </p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm border border-white/60 hover:bg-white/60 transition-all">
            <h3 className="text-xl font-semibold mb-4">Verified Opportunities</h3>
            <p className="text-muted-foreground">
              All programs, investors, and startups are vetted for quality and legitimacy.
            </p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm border border-white/60 hover:bg-white/60 transition-all">
            <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
            <p className="text-muted-foreground">
              Built by and for the Ethiopian innovation ecosystem to foster collaboration and growth.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
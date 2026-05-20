'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="text-xs font-medium px-3 py-1 rounded-full border border-primary/30 text-primary bg-primary/5">
              A place where each idea unfolds
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-foreground">
            Connect Ideas to
            <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-medium">
              Opportunities
            </span>
          </h1>

          <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
            Innobiz-K is Ethiopia's startup ecosystem platform. Connect with investors, discover innovative startups, and scale your business within a transparent and supportive environment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="px-6 py-3 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-sm transition-colors flex items-center justify-center gap-2">
              Explore Platform
              <ArrowRight size={14} />
            </button>
            <button className="px-6 py-3 text-xs font-medium text-foreground border border-border hover:bg-muted rounded-sm transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="grid grid-cols-2 gap-3 h-96">
            {/* Large main image - Modern workspace */}
            <div className="col-span-1 row-span-2 relative overflow-hidden rounded-sm border border-border shadow-lg">
              <Image 
                src="/hero-2.png" 
                alt="Modern collaborative workspace" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Top right - Creative workspace */}
            <div className="col-span-1 relative overflow-hidden rounded-sm border border-border shadow-lg">
              <Image 
                src="/hero-1.png" 
                alt="Creative workspace environment" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Floating stat card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm border border-white/20 rounded p-3 shadow-lg">
                <p className="text-xs font-semibold text-foreground">100+ Startups Connected</p>
                <p className="text-xs text-muted-foreground mt-1">Growing ecosystem</p>
              </div>
            </div>

            {/* Bottom right - Inspiring workspace */}
            <div className="col-span-1 relative overflow-hidden rounded-sm border border-border shadow-lg">
              <Image 
                src="/hero-3.png" 
                alt="Inspiring meeting space" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

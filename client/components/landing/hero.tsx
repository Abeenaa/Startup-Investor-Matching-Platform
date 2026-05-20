'use client'

import { AnimatedMarqueeHero } from '@/components/ui/hero-3'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
]

export default function Hero() {
  return (
    <AnimatedMarqueeHero
      tagline="Ethiopia's startup ecosystem platform"
      title={
        <>
          Turn stronger ideas into
          <br />
          stronger opportunities.
        </>
      }
      description="Innobiz-K creates a modern bridge between founders, investors, reviewers, and program operators with cleaner discovery, more transparent workflows, and a sharper digital experience."
      ctaText="Explore the platform"
      ctaHref="/signup"
      secondaryCtaText="Learn about Innobiz-K"
      secondaryCtaHref="/#about"
      images={HERO_IMAGES}
    />
  )
}

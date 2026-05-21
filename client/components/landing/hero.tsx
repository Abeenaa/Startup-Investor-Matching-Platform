'use client'

import { AnimatedMarqueeHero } from '@/components/ui/hero-3'

const HERO_IMAGES = [
  '/hero/1.jpg',
  '/hero/2.jpg',
  '/hero/3.jpg',
  '/hero/4.jpg',
  '/hero/5.jpg',
  '/hero/6.jpg',
  '/hero/7.png',
  '/hero/8.png',
  '/hero/9.png',
  '/hero/10.png',
  '/hero/11.png'
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

"use client";

import { AnimatedMarqueeHero } from "@/components/ui/hero-3";

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1552664730-d307ca88497a?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1521737604895-57724b5e3fb8?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551288049-beb1df5c03d3?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551650992-ee4fd47df41f?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1552664730-d307ca88497a?w=900&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=900&auto=format&fit=crop&q=60",
];

const AnimatedHeroDemo = () => {
  return (
    <AnimatedMarqueeHero
      tagline="Join over 100,000 happy creators"
      title={
        <>
          Connect Ideas to
          <br />
          Opportunities
        </>
      }
      description="Innobiz-K is Ethiopia's startup ecosystem platform. Connect with investors, discover innovative startups, and scale your business."
      ctaText="Get Started"
      images={DEMO_IMAGES}
    />
  );
};

export default AnimatedHeroDemo;

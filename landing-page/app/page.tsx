import Header from '@/components/header'
import Hero from '@/components/hero'
import Stats from '@/components/stats'
import HowItWorks from '@/components/how-it-works'
import Features from '@/components/features'
import Programs from '@/components/programs'
import Startups from '@/components/startups'
import Investors from '@/components/investors'
import About from '@/components/about'
import Testimonials from '@/components/testimonials'
import CTA from '@/components/cta'
import Footer from '@/components/footer'
import Partners from '@/components/partners'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Stats />
      <Partners />
      <About />
      <HowItWorks />
      <Features />
      <Programs />
      <Startups />
      <Investors />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  )
}

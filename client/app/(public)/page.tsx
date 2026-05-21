import Header from '@/components/landing/header'
import Hero from '@/components/landing/hero'
import Stats from '@/components/landing/stats'
import Partners from '@/components/landing/partners'
import WhyInnobizK from '@/components/landing/why-innobiz-k'
import About from '@/components/landing/about'
import HowItWorks from '@/components/landing/how-it-works'
import Features from '@/components/landing/features'
import Programs from '@/components/landing/programs'
import Startups from '@/components/landing/startups'
import Investors from '@/components/landing/investors'
import Testimonials from '@/components/landing/testimonials'
import CTA from '@/components/landing/cta'
import Footer from '@/components/landing/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Stats />
      <Partners />
      <WhyInnobizK />
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

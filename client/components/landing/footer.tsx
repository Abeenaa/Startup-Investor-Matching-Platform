'use client'

import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  platform: [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Programs', href: '/#programs' },
    { label: 'Startups', href: '/#startups' },
    { label: 'Investors', href: '/#investors' },
  ],
  portals: [
    { label: 'Startup Portal', href: 'http://localhost:3005' },
    { label: 'Investor Portal', href: 'http://localhost:3004' },
    { label: 'Reviewer Portal', href: 'http://localhost:3002' },
    { label: 'Staff Admin', href: 'http://localhost:3001' },
  ],
  company: [
    { label: 'About Innobiz-K', href: '/#about' },
    { label: 'Success Stories', href: '/#testimonials' },
    { label: 'Contact', href: '#contact' },
    { label: 'Ministry of Innovation', href: 'https://mint.gov.et' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="innobiz-shell max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Image src="/logo.svg" alt="Innobiz-K" width={31} height={18} className="h-7 w-auto" />
              <span className="innobiz-title text-xs font-semibold tracking-[0.2em] text-foreground">INNOBIZ-K</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Ethiopia's national startup ecosystem platform. Connecting founders, investors, and program operators in one unified digital environment.
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              Ministry of Innovation and Technology (MInT)
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold text-foreground">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold text-foreground">Portals</h3>
            <ul className="space-y-2">
              {footerLinks.portals.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Innobiz-K · Ministry of Innovation and Technology, Ethiopia. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Terms of Use</Link>
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/programs', label: 'Programs' },
  { href: '/startups', label: 'Startups' },
  { href: '/investors', label: 'Investors' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
      <nav className="innobiz-shell flex items-center justify-between py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/innobiz-k.png" alt="Innobiz-K" width={140} height={40} className="h-7 w-auto" loading="eager" />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-foreground transition-colors hover:bg-muted md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={`${isOpen ? 'block' : 'hidden'} absolute left-0 right-0 top-[72px] border-b border-border bg-background p-4 md:static md:flex md:w-auto md:border-0 md:bg-transparent md:p-0`}>
            <div className="flex w-full flex-col gap-6 md:w-auto md:flex-row md:items-center md:gap-8">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                  className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 md:hidden">
                <Link href="/login" onClick={() => setIsOpen(false)} className="rounded-full px-4 py-2 text-center text-xs font-medium text-foreground transition-colors hover:bg-muted">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="rounded-full bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden gap-4 md:flex">
            <Link href="/login" className="rounded-full px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted">
              Login
            </Link>
            <Link href="/signup" className="rounded-full bg-primary px-5 py-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

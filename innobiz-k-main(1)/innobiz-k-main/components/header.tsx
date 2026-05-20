'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Innobiz-K" width={31} height={18} className="h-6 w-auto" loading="eager" />
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground hover:bg-muted rounded-sm transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} md:flex absolute md:static top-16 left-0 right-0 md:w-auto bg-background md:bg-transparent border-b md:border-0 border-border p-4 md:p-0`}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full md:w-auto">
            <Link href="/#startups" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Startups
            </Link>
            <Link href="/#investors" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Investors
            </Link>
            <Link href="/#programs" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              Programs
            </Link>
            <Link href="/#about" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <div className="flex flex-col md:hidden gap-3 mt-4 pt-4 border-t border-border">
              <Link href="/login" className="px-4 py-2 text-xs font-medium text-foreground hover:bg-muted rounded transition-colors text-center">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded transition-colors text-center">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-4">
          <Link href="/login" className="px-4 py-2 text-xs font-medium text-foreground hover:bg-muted rounded-sm transition-colors">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-sm transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  )
}

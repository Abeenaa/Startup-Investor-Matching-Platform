import type { Metadata } from 'next'
import { Roboto, Space_Grotesk } from 'next/font/google'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Innobiz-K — Ethiopia\'s Startup Ecosystem Platform',
  description: 'Innobiz-K connects Ethiopian startups, investors, reviewers, and program administrators in one unified digital ecosystem. Discover opportunities, apply to programs, and grow.',
  keywords: ['Ethiopia startups', 'startup ecosystem', 'innovation', 'investors Ethiopia', 'MInT', 'Innobiz-K', 'funding programs'],
  openGraph: {
    title: 'Innobiz-K — Ethiopia\'s Startup Ecosystem Platform',
    description: 'Connecting Ethiopian startups with investors, programs, and opportunities.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
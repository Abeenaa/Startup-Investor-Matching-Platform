'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, ExternalLink } from 'lucide-react'

const investors = [
  { id: 1, name: 'Ethio Ventures', focus: 'FinTech', stage: 'Seed', invested: '$50K', contact: 'contact@ethioventures.com' },
  { id: 2, name: 'Africa Growth Fund', focus: 'All Sectors', stage: 'Series A', invested: '$100K+', contact: 'hello@africagrowth.fund' },
  { id: 3, name: 'Accel Africa', focus: 'Tech', stage: 'Series B', invested: '$500K+', contact: 'teams@accel.africa' },
  { id: 4, name: 'Khan Academy Partners', focus: 'EdTech', stage: 'Early', invested: 'Variable', contact: 'invest@khan.partners' },
]

export default function InvestorsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Connect with Investors</h1>
          <p className="text-xs text-muted-foreground">Find and reach out to investors interested in your sector</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investors.map(investor => (
          <Card key={investor.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground text-sm">{investor.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{investor.focus}</p>
              </div>
              <Badge className="bg-primary/10 text-primary text-xs">{investor.stage}</Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Investment Range</p>
                <p className="text-sm font-medium text-foreground">{investor.invested}</p>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-border">
                <Button size="sm" className="flex-1 h-8 text-xs gap-1.5 bg-secondary">
                  <Mail size={14} />
                  Contact
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5">
                  <ExternalLink size={14} />
                  Profile
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Flame } from 'lucide-react'

const opportunities = [
  { id: 1, company: 'BlockChain Ethiopia', sector: 'FinTech', asking: '$500K', stage: 'Series A', hot: true },
  { id: 2, company: 'Green Energy Tech', sector: 'CleanTech', asking: '$300K', stage: 'Seed', hot: true },
  { id: 3, company: 'LogiTrack Africa', sector: 'Supply Chain', asking: '$750K', stage: 'Series A', hot: false },
  { id: 4, company: 'MediConnect', sector: 'HealthTech', asking: '$400K', stage: 'Seed', hot: false },
]

export default function OpportunitiesPage() {
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
          <h1 className="text-xl font-semibold text-foreground">Investment Opportunities</h1>
          <p className="text-xs text-muted-foreground">Discover new startups looking for funding</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map(opp => (
          <Card key={opp.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{opp.company}</h3>
                  {opp.hot && <Flame size={16} className="text-accent" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{opp.sector}</p>
              </div>
              <Badge className="bg-primary/10 text-primary text-xs">{opp.stage}</Badge>
            </div>

            <div className="mb-4 p-3 bg-muted/30 rounded text-sm">
              <p className="text-xs text-muted-foreground">Asking for</p>
              <p className="font-semibold text-foreground text-lg">{opp.asking}</p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 h-9 text-xs bg-secondary">View Pitch</Button>
              <Button variant="outline" className="flex-1 h-9 text-xs">Message</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

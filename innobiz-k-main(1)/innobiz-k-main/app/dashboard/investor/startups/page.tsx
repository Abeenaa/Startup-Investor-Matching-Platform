'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Zap, TrendingUp } from 'lucide-react'

const startups = [
  {
    id: 1,
    name: 'FintechPro',
    stage: 'Seed',
    sector: 'FinTech',
    fundingAsked: '$250K',
    description: 'AI-powered financial advisory platform for small businesses.',
    team: 5,
  },
  {
    id: 2,
    name: 'HealthTrack',
    stage: 'Series A',
    sector: 'HealthTech',
    fundingAsked: '$1.2M',
    description: 'Remote health monitoring and telemedicine platform.',
    team: 12,
  },
  {
    id: 3,
    name: 'AgriFlow',
    stage: 'Pre-Seed',
    sector: 'AgriTech',
    fundingAsked: '$100K',
    description: 'Precision agriculture solutions using IoT sensors.',
    team: 3,
  },
  {
    id: 4,
    name: 'EduNext',
    stage: 'Seed',
    sector: 'EdTech',
    fundingAsked: '$500K',
    description: 'Adaptive learning platform for K-12 education.',
    team: 8,
  },
  {
    id: 5,
    name: 'LogisticHub',
    stage: 'Series A',
    sector: 'Logistics',
    fundingAsked: '$2M',
    description: 'Supply chain optimization through AI and blockchain.',
    team: 15,
  },
  {
    id: 6,
    name: 'GreenEnergy',
    stage: 'Seed',
    sector: 'CleanTech',
    fundingAsked: '$750K',
    description: 'Renewable energy management system for enterprises.',
    team: 6,
  },
]

const stageColors = {
  'Pre-Seed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Seed': 'bg-green-50 text-green-700 border-green-200',
  'Series A': 'bg-purple-50 text-purple-700 border-purple-200',
  'Series B': 'bg-orange-50 text-orange-700 border-orange-200',
}

export default function StartupsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Discover Startups</h1>
        <p className="text-xs text-muted-foreground mt-1">Find promising startups seeking investment</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {startups.map(startup => (
          <Card key={startup.id} className="p-6 border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{startup.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{startup.description}</p>
              </div>
              <Badge className={`text-xs ${stageColors[startup.stage as keyof typeof stageColors]} border`}>
                {startup.stage}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2 py-1 bg-muted rounded">{startup.sector}</span>
              <span className="text-xs px-2 py-1 bg-muted rounded">Team: {startup.team}</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-medium">{startup.fundingAsked}</span>
            </div>

            <div className="flex gap-2">
              <Button className="text-xs h-8 flex-1 bg-primary hover:bg-primary/90">
                View Details
              </Button>
              <Button variant="outline" className="text-xs h-8 flex-1">
                Contact
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

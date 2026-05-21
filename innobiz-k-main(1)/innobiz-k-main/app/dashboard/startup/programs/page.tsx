'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Users, Award } from 'lucide-react'

const programs = [
  { id: 1, name: 'Seed Accelerator 2024', type: 'Accelerator', duration: '3 months', cohortSize: '20', deadline: '2024-04-30', status: 'open' },
  { id: 2, name: 'Growth Fund', type: 'Investment', duration: 'Ongoing', cohortSize: 'N/A', deadline: '2024-12-31', status: 'open' },
  { id: 3, name: 'Mentorship Program', type: 'Mentorship', duration: '6 months', cohortSize: '30', deadline: '2024-03-31', status: 'closing' },
  { id: 4, name: 'Tech Innovation Lab', type: 'Incubator', duration: '12 months', cohortSize: '15', deadline: '2024-05-15', status: 'open' },
]

export default function ProgramsPage() {
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
          <h1 className="text-xl font-semibold text-foreground">Available Programs</h1>
          <p className="text-xs text-muted-foreground">Browse and apply to startup programs</p>
        </div>
      </div>

      <div className="space-y-4">
        {programs.map(program => (
          <Card key={program.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{program.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{program.type}</p>
              </div>
              <Badge className={program.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {program.status === 'open' ? 'Open' : 'Closing Soon'}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex gap-2 items-center text-xs">
                <Clock size={14} className="text-muted-foreground" />
                <span>{program.duration}</span>
              </div>
              <div className="flex gap-2 items-center text-xs">
                <Users size={14} className="text-muted-foreground" />
                <span>{program.cohortSize} slots</span>
              </div>
              <div className="flex gap-2 items-center text-xs">
                <Award size={14} className="text-muted-foreground" />
                <span>Deadline: {program.deadline}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 h-9 text-xs bg-primary">View Details</Button>
              <Button variant="outline" className="flex-1 h-9 text-xs">Apply Now</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

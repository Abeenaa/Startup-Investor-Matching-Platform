'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react'

const submissions = [
  { id: 1, company: 'TechStart Ethiopia', program: 'Seed Accelerator', submittedDate: '2024-03-20', status: 'submitted', score: 78 },
  { id: 2, company: 'AgriTech Solutions', program: 'Growth Fund', submittedDate: '2024-03-18', status: 'submitted', score: 85 },
  { id: 3, company: 'EdHub Africa', program: 'Mentorship Program', submittedDate: '2024-03-15', status: 'submitted', score: 72 },
  { id: 4, company: 'HealthVenture', program: 'Innovation Lab', submittedDate: '2024-03-10', status: 'submitted', score: 88 },
]

export default function SubmissionsPage() {
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
          <h1 className="text-xl font-semibold text-foreground">Your Submissions</h1>
          <p className="text-xs text-muted-foreground">View all submitted reviews and scores</p>
        </div>
      </div>

      <div className="space-y-3">
        {submissions.map(submission => (
          <Card key={submission.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{submission.company}</h3>
                <p className="text-xs text-muted-foreground mt-1">{submission.program}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="text-lg font-bold text-primary">{submission.score}/100</p>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="text-xs text-foreground">{submission.submittedDate}</p>
                </div>

                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle size={14} className="mr-1" />
                  Submitted
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

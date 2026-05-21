'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

const conflicts = [
  {
    id: 1,
    startup: 'TechVenture Labs',
    relationship: 'Former Employment',
    status: 'Declared',
    date: '2024-03-15',
    action: 'Excluded from review',
  },
  {
    id: 2,
    startup: 'GreenEnergy Solutions',
    relationship: 'Family Connection',
    status: 'Pending Review',
    date: '2024-03-18',
    action: 'Awaiting approval',
  },
  {
    id: 3,
    startup: 'FinTech Innovations',
    relationship: 'Investment Interest',
    status: 'Approved',
    date: '2024-03-12',
    action: 'Can review with disclosure',
  },
]

export default function ConflictsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Conflict of Interest Management</h1>
        <p className="text-xs text-muted-foreground mt-1">Declare and manage potential conflicts before reviewing applications</p>
      </div>

      <Card className="p-6 border-l-4 border-l-secondary">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-secondary mt-1" size={18} />
          <div>
            <p className="text-sm font-medium text-foreground">Important: Conflict Disclosure</p>
            <p className="text-xs text-muted-foreground mt-1">You must declare any relationships or interests that could bias your evaluation. Failure to disclose conflicts of interest may result in removal from the review process.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Your Declared Conflicts</h2>
            <p className="text-xs text-muted-foreground mt-1">Track all your conflict declarations</p>
          </div>
          <Button className="text-xs h-8 bg-primary hover:bg-primary/90">
            Declare New Conflict
          </Button>
        </div>

        <div className="space-y-3">
          {conflicts.map(conflict => (
            <div key={conflict.id} className="flex items-center justify-between p-4 border border-border rounded hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{conflict.startup}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{conflict.relationship}</span>
                  <span className="text-xs text-muted-foreground">Declared: {conflict.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{conflict.action}</p>
                </div>
                <Badge className={`text-xs ${
                  conflict.status === 'Declared' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  conflict.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                } border`}>
                  {conflict.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Guidelines for Declaring Conflicts</h2>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="text-primary font-semibold">1.</div>
            <div>
              <p className="text-xs font-medium text-foreground">Employment Relationships</p>
              <p className="text-xs text-muted-foreground">Declare if you currently work for or have worked for the startup in the past 3 years</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-semibold">2.</div>
            <div>
              <p className="text-xs font-medium text-foreground">Financial Interests</p>
              <p className="text-xs text-muted-foreground">Declare any investments, loans, or financial interests in the startup</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-semibold">3.</div>
            <div>
              <p className="text-xs font-medium text-foreground">Personal Relationships</p>
              <p className="text-xs text-muted-foreground">Declare if you have family or close personal relationships with founders or key team members</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-primary font-semibold">4.</div>
            <div>
              <p className="text-xs font-medium text-foreground">Competitive Interests</p>
              <p className="text-xs text-muted-foreground">Declare if you work for a competing organization in the same sector</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

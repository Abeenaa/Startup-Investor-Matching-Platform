'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'

const programs = [
  { id: 1, name: 'Seed Accelerator 2024', type: 'Accelerator', applications: 145, approved: 23, deadline: '2024-04-30', status: 'Active' },
  { id: 2, name: 'Growth Fund', type: 'Investment', applications: 78, approved: 12, deadline: '2024-12-31', status: 'Active' },
  { id: 3, name: 'Mentorship Program', type: 'Mentorship', applications: 234, approved: 30, deadline: '2024-03-31', status: 'Closing' },
  { id: 4, name: 'Tech Innovation Lab', type: 'Incubator', applications: 89, approved: 15, deadline: '2024-05-15', status: 'Active' },
]

const statusColors: any = {
  'Active': 'bg-green-100 text-green-700',
  'Closing': 'bg-yellow-100 text-yellow-700',
  'Closed': 'bg-red-100 text-red-700',
}

export default function ProgramsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Manage Programs</h1>
            <p className="text-xs text-muted-foreground">Create and manage startup programs</p>
          </div>
        </div>
        <Button className="bg-primary text-xs h-9">Create Program</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.map(program => (
          <Card key={program.id} className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{program.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{program.type}</p>
              </div>
              <Badge className={statusColors[program.status] || 'bg-gray-100 text-gray-700'}>
                {program.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4 p-3 bg-muted/30 rounded">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Applications</span>
                <span className="font-semibold text-foreground">{program.applications}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Approved</span>
                <span className="font-semibold text-green-700">{program.approved}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Deadline</span>
                <span className="font-semibold text-foreground">{program.deadline}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5">
                <Edit size={14} />
                Edit
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5 text-red-600 hover:bg-red-50">
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

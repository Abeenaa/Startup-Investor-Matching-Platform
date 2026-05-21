'use client'

import { Card } from '@/components/ui/card'
import { FileText, Video, BookOpen, Lightbulb, Users, Calendar } from 'lucide-react'

const resources = [
  {
    id: 1,
    title: 'Startup Fundamentals Guide',
    description: 'Essential guide covering business model, market research, and pitch deck preparation.',
    type: 'Guide',
    icon: BookOpen,
    date: '2024-03-20',
  },
  {
    id: 2,
    title: 'Pitch Deck Template',
    description: 'Professional pitch deck template with best practices and examples.',
    type: 'Template',
    icon: FileText,
    date: '2024-03-18',
  },
  {
    id: 3,
    title: 'Financial Planning for Startups',
    description: 'Learn how to create budgets, forecast growth, and manage cash flow.',
    type: 'Course',
    icon: Video,
    date: '2024-03-15',
  },
  {
    id: 4,
    title: 'Product-Market Fit Workshop',
    description: 'Webinar series on achieving and validating product-market fit.',
    type: 'Workshop',
    icon: Users,
    date: '2024-03-10',
  },
  {
    id: 5,
    title: 'Legal Documents Checklist',
    description: 'Complete checklist of legal documents needed for your startup.',
    type: 'Checklist',
    icon: Lightbulb,
    date: '2024-03-05',
  },
  {
    id: 6,
    title: 'Monthly Mentorship Sessions',
    description: 'Book one-on-one mentorship sessions with industry experts.',
    type: 'Event',
    icon: Calendar,
    date: '2024-03-01',
  },
]

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Resources & Learning</h1>
        <p className="text-xs text-muted-foreground mt-1">Access guides, templates, and training materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(resource => {
          const Icon = resource.icon
          return (
            <Card key={resource.id} className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <Icon className="text-primary" size={24} />
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                  {resource.type}
                </span>
              </div>
              <h3 className="font-medium text-sm text-foreground mb-2">{resource.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{resource.description}</p>
              <p className="text-xs text-muted-foreground">{resource.date}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

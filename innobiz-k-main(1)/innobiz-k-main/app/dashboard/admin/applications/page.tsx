'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Download, Filter } from 'lucide-react'

const applications = [
  { id: 1, startup: 'TechFlow Innovations', program: 'Seed Accelerator', stage: 'Under Review', date: '2024-03-20', reviews: 2 },
  { id: 2, startup: 'GreenAgri Solutions', program: 'Growth Fund', stage: 'Approved', date: '2024-03-18', reviews: 3 },
  { id: 3, startup: 'HealthConnect', program: 'Mentorship', stage: 'Rejected', date: '2024-03-15', reviews: 2 },
  { id: 4, startup: 'EdTech Pro', program: 'Seed Accelerator', stage: 'Under Review', date: '2024-03-22', reviews: 1 },
  { id: 5, startup: 'FinServe AI', program: 'Growth Fund', stage: 'Approved', date: '2024-03-12', reviews: 3 },
]

export default function ApplicationsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Application Management</h1>
        <p className="text-xs text-muted-foreground mt-1">Monitor and manage all startup applications</p>
      </div>

      <Card className="p-4 border-0 shadow-none bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="w-full pl-9 pr-4 py-2 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button variant="outline" className="text-xs h-9 px-3">
            <Filter size={14} className="mr-2" />
            Filter
          </Button>
          <Button className="text-xs h-9 bg-primary hover:bg-primary/90">
            <Download size={14} className="mr-2" />
            Export
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-foreground">All Applications</h2>
          <p className="text-xs text-muted-foreground mt-1">{applications.length} total applications</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Startup</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Program</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stage</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Reviews</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-foreground">{app.startup}</td>
                  <td className="py-3 px-4 text-muted-foreground">{app.program}</td>
                  <td className="py-3 px-4">
                    <Badge className={`text-xs ${
                      app.stage === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      app.stage === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    } border`}>
                      {app.stage}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{app.date}</td>
                  <td className="py-3 px-4 text-muted-foreground">{app.reviews}</td>
                  <td className="py-3 px-4">
                    <Button variant="outline" className="text-xs h-7">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

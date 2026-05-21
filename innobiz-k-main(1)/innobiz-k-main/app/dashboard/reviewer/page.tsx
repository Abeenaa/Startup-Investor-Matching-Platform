'use client'

// Fixed eval reserved keyword issue
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogOut, FileCheck, AlertCircle, CheckCircle, Clock, Menu, X } from 'lucide-react'

const evaluationStats = [
  { label: 'Applications Reviewed', value: 24, icon: CheckCircle, color: 'text-primary' },
  { label: 'Pending Reviews', value: 5, icon: AlertCircle, color: 'text-secondary' },
  { label: 'Conflicts of Interest', value: 2, icon: AlertCircle, color: 'text-accent' },
  { label: 'Completed This Month', value: 18, icon: FileCheck, color: 'text-primary' },
]

const evaluationQueue = [
  { id: 1, startup: 'TechStart Innovation', program: 'Seed Accelerator', submitted: '2024-03-20', status: 'In Progress', score: 7.5 },
  { id: 2, startup: 'GreenEnergy Solutions', program: 'Impact Fund', submitted: '2024-03-18', status: 'Completed', score: 8.2 },
  { id: 3, startup: 'FinTech Hub', program: 'Growth Program', submitted: '2024-03-15', status: 'In Progress', score: null },
  { id: 4, startup: 'HealthCare Plus', program: 'Innovation Track', submitted: '2024-03-10', status: 'Completed', score: 7.8 },
  { id: 5, startup: 'AgriTech Valley', program: 'Rural Development', submitted: '2024-03-08', status: 'Pending', score: null },
]

export default function ReviewerDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('Reviewer')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
    } else {
      const userData = JSON.parse(user)
      if (userData.role !== 'reviewer') {
        router.push('/login')
      }
      setUserName(userData.fullName || userData.email || 'Reviewer')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 border-r border-border bg-background transition-all duration-300 fixed md:static h-full z-40`}>
        <div className="p-6 border-b border-border">
          <Image src="/logo.svg" alt="Innobiz-K" width={31} height={18} className="h-6 w-auto" loading="eager" />
          <p className="text-xs text-muted-foreground mt-2">Reviewer Portal</p>
        </div>

        <nav className="p-6 space-y-1 flex flex-col justify-between h-[calc(100%-80px)]">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-4">MENU</div>
            <Link href="/dashboard/reviewer" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-primary bg-primary/5 border-l-2 border-l-primary rounded-r">
              Dashboard
            </Link>
            <Link href="/dashboard/reviewer/submissions" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              My Submissions
            </Link>
            <Link href="/dashboard/reviewer/scoring" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Scoring Guide
            </Link>
            <Link href="/dashboard/reviewer/conflicts" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Conflicts
            </Link>
            <Link href="/dashboard/reviewer/help" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Help
            </Link>
          </div>
          <div className="border-t border-border pt-4">
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/5 rounded transition-colors flex items-center gap-2">
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between p-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex-1 md:flex-none">
              <h1 className="text-sm font-semibold text-foreground">Welcome back, {userName}</h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold text-foreground">Reviewer Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-1">Review and evaluate startup applications</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluationStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="p-4 border-l-4 border-l-primary">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-2xl font-semibold text-foreground mt-2">{stat.value}</p>
                    </div>
                    <Icon className={`${stat.color}`} size={20} />
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Evaluation Queue */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Evaluation Queue</h2>
                <p className="text-xs text-muted-foreground">Applications awaiting your review</p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs">
                5 Pending
              </Badge>
            </div>
            <div className="space-y-3">
              {evaluationQueue.map(application => (
                <div key={application.id} className="flex items-center justify-between p-4 border border-border rounded hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{application.startup}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{application.program}</span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded">Submitted: {application.submitted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {application.score && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{application.score}/10</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    )}
                    <Badge className={`text-xs ${
                      application.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      application.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    } border`}>
                      {application.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button className="text-xs h-9 bg-primary hover:bg-primary/90">
                Start New Review
              </Button>
              <Button variant="outline" className="text-xs h-9">
                Continue In Progress
              </Button>
              <Button variant="outline" className="text-xs h-9">
                View Scoring Criteria
              </Button>
              <Button variant="outline" className="text-xs h-9">
                Declare Conflict
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

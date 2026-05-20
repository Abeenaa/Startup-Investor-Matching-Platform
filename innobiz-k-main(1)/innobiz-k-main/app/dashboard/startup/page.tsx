'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { LogOut, Eye, FileText, Users, TrendingUp, Menu, X } from 'lucide-react'

const chartData = [
  { date: 'Mar 1', views: 40 },
  { date: 'Mar 8', views: 65 },
  { date: 'Mar 15', views: 85 },
  { date: 'Mar 22', views: 120 },
  { date: 'Mar 29', views: 150 },
]

const applications = [
  { id: 1, program: 'Seed Accelerator Program', status: 'In Review', date: '2024-03-20', stage: 'Initial Review' },
  { id: 2, program: 'Growth Fund 2024', status: 'Approved', date: '2024-03-15', stage: 'Portfolio Stage' },
  { id: 3, program: 'Mentorship Program', status: 'Pending', date: '2024-03-10', stage: 'Submitted' },
]

const statusColors: any = {
  'In Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Approved': 'bg-green-50 text-green-700 border-green-200',
  'Pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200',
}

export default function StartupDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('Startup Founder')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== 'startup') {
      router.push(`/dashboard/${userData.role}`)
      return
    }
    setUserName(userData.fullName || userData.email || 'Startup Founder')
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} md:w-64 border-r border-border bg-background transition-all duration-300 fixed md:static h-full z-40`}>
        <div className="p-6 border-b border-border">
          <Image src="/logo.svg" alt="Innobiz-K" width={31} height={18} className="h-6 w-auto" loading="eager" />
          <p className="text-xs text-muted-foreground mt-2">Startup Hub</p>
        </div>

        <nav className="p-6 space-y-1 flex flex-col justify-between h-[calc(100%-80px)]">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-4">MENU</div>
            <Link href="/dashboard/startup" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-primary bg-primary/5 border-l-2 border-l-primary rounded-r">
              Dashboard
            </Link>
            <Link href="/dashboard/startup/profile" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              My Profile
            </Link>
            <Link href="/dashboard/startup/programs" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Programs
            </Link>
            <Link href="/dashboard/startup/investors" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Investors
            </Link>
            <Link href="/dashboard/startup/resources" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Resources
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
      <div className="flex-1">
        {/* Top Bar */}
        <div className="border-b border-border bg-background sticky top-0 z-30">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 hover:bg-muted rounded">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Welcome back, {userName}</h1>
                <p className="text-xs text-muted-foreground">Track your startup progress and opportunities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-primary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Profile Views</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">324</p>
                  <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
                </div>
                <Eye className="text-primary opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-secondary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Active Applications</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">3</p>
                  <p className="text-xs text-muted-foreground mt-2">1 awaiting review</p>
                </div>
                <FileText className="text-secondary opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-accent">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Investor Connections</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">12</p>
                  <p className="text-xs text-muted-foreground mt-2">3 new this week</p>
                </div>
                <Users className="text-accent opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-primary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Available Programs</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">8</p>
                  <p className="text-xs text-muted-foreground mt-2">View all programs</p>
                </div>
                <TrendingUp className="text-primary opacity-60" size={20} />
              </div>
            </Card>
          </div>

          {/* Charts and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <Card className="lg:col-span-2 p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-foreground">Profile Views Trend</h2>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid #e0e0e0', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="views" stroke="#00d9ff" strokeWidth={2} dot={{ fill: '#00d9ff', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  Browse Programs
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  View Investors
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  Contact Support
                </Button>
                <Button className="w-full text-xs h-9 bg-primary hover:bg-primary/90 mt-2">
                  New Application
                </Button>
              </div>
            </Card>
          </div>

          {/* Applications Table */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-foreground">Recent Applications</h2>
              <p className="text-xs text-muted-foreground">Track your program applications and status</p>
            </div>
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 border border-border rounded hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{app.program}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{app.date}</span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded">Stage: {app.stage}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${statusColors[app.status]} border`}>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

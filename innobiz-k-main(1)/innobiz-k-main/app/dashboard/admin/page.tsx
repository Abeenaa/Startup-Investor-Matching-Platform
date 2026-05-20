'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogOut, Users, FileText, Zap, AlertCircle, Settings, BarChart3, Menu, X } from 'lucide-react'

const programs = [
  {
    id: 1,
    name: 'Pre-Seed Accelerator',
    status: 'active',
    applications: 45,
    approvedCount: 8,
    startDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Seed Round Fund',
    status: 'active',
    applications: 38,
    approvedCount: 12,
    startDate: '2024-02-01',
  },
  {
    id: 3,
    name: 'Series A Pipeline',
    status: 'review',
    applications: 22,
    approvedCount: 5,
    startDate: '2024-03-10',
  },
  {
    id: 4,
    name: 'Mentorship Program',
    status: 'active',
    applications: 28,
    approvedCount: 14,
    startDate: '2024-01-20',
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('Admin')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== 'admin') {
      router.push(`/dashboard/${userData.role}`)
      return
    }
    setUserName(userData.fullName || userData.email || 'Admin')
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
          <p className="text-xs text-muted-foreground mt-2">Admin Panel</p>
        </div>

        <nav className="p-6 space-y-1 flex flex-col justify-between h-[calc(100%-80px)]">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-4">MENU</div>
            <Link href="/dashboard/admin" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-primary bg-primary/5 border-l-2 border-l-primary rounded-r">
              Dashboard
            </Link>
            <Link href="/dashboard/admin/users" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Users
            </Link>
            <Link href="/dashboard/admin/programs" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Programs
            </Link>
            <Link href="/dashboard/admin/applications" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Applications
            </Link>
            <Link href="/dashboard/admin/reports" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Reports
            </Link>
            <Link href="/dashboard/admin/settings" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Settings
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
                <h1 className="text-lg font-semibold text-foreground">Platform Administration</h1>
                <p className="text-xs text-muted-foreground">System overview and management tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* System Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-primary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Active Users</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">1,247</p>
                  <p className="text-xs text-green-600 mt-2">↑ 45 this week</p>
                </div>
                <Users className="text-primary opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-secondary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Total Applications</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">342</p>
                  <p className="text-xs text-muted-foreground mt-2">73 awaiting review</p>
                </div>
                <FileText className="text-secondary opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-accent">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Active Programs</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">8</p>
                  <p className="text-xs text-muted-foreground mt-2">1 under review</p>
                </div>
                <Zap className="text-accent opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-primary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Pending Actions</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">12</p>
                  <p className="text-xs text-orange-600 mt-2">Requires attention</p>
                </div>
                <AlertCircle className="text-primary opacity-60" size={20} />
              </div>
            </Card>
          </div>

          {/* Program Management */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Program Management</h2>
                <p className="text-xs text-muted-foreground">Active and pending programs</p>
              </div>
              <Button className="text-xs h-9 bg-primary hover:bg-primary/90">
                New Program
              </Button>
            </div>
            <div className="space-y-3">
              {programs.map(program => (
                <div key={program.id} className="flex items-center justify-between p-4 border border-border rounded hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{program.name}</p>
                    <div className="flex gap-3 mt-1">
                      <Badge className={`text-xs ${
                        program.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      } border`}>
                        {program.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Started: {program.startDate}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{program.applications}</p>
                    <p className="text-xs text-muted-foreground">{program.approvedCount} approved</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Administrative Tools */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">Administrative Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="text-xs h-9 flex items-center justify-center gap-2">
                <Users size={14} />
                Manage Users
              </Button>
              <Button variant="outline" className="text-xs h-9 flex items-center justify-center gap-2">
                <Settings size={14} />
                Program Settings
              </Button>
              <Button variant="outline" className="text-xs h-9 flex items-center justify-center gap-2">
                <BarChart3 size={14} />
                View Reports
              </Button>
              <Button variant="outline" className="text-xs h-9 flex items-center justify-center gap-2">
                <FileText size={14} />
                System Logs
              </Button>
              <Button variant="outline" className="text-xs h-9 col-span-1 sm:col-span-2">
                Bulk Actions
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

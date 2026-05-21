'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LogOut, TrendingUp, DollarSign, Zap, Target, Menu, X } from 'lucide-react'

const sectorData = [
  { name: 'FinTech', value: 35, color: '#00d9ff' },
  { name: 'HealthTech', value: 25, color: '#ff006e' },
  { name: 'AgriTech', value: 20, color: '#0ea5e9' },
  { name: 'EdTech', value: 20, color: '#fbbf24' },
]

const portfolioData = [
  { stage: 'Pre-Seed', companies: 4 },
  { stage: 'Seed', companies: 8 },
  { stage: 'Series A', companies: 3 },
  { stage: 'Series B', companies: 1 },
]

const opportunities = [
  { id: 1, startup: 'TechFlow Innovations', sector: 'FinTech', amount: '$500K', stage: 'Seed', roi: '+45%' },
  { id: 2, startup: 'GreenAgri Solutions', sector: 'AgriTech', amount: '$300K', stage: 'Pre-Seed', roi: '+28%' },
  { id: 3, startup: 'HealthConnect', sector: 'HealthTech', amount: '$1.2M', stage: 'Series A', roi: '+62%' },
]

export default function InvestorDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState('Investor')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== 'investor') {
      router.push(`/dashboard/${userData.role}`)
      return
    }
    setUserName(userData.fullName || userData.email || 'Investor')
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
          <p className="text-xs text-muted-foreground mt-2">Investor Portal</p>
        </div>

        <nav className="p-6 space-y-1 flex flex-col justify-between h-[calc(100%-80px)]">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-4">MENU</div>
            <Link href="/dashboard/investor" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-primary bg-primary/5 border-l-2 border-l-primary rounded-r">
              Dashboard
            </Link>
            <Link href="/dashboard/investor/portfolio" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Portfolio
            </Link>
            <Link href="/dashboard/investor/opportunities" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Opportunities
            </Link>
            <Link href="/dashboard/investor/startups" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Startups
            </Link>
            <Link href="/dashboard/investor/returns" className="block w-full text-left px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded transition-colors">
              Returns
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
                <h1 className="text-lg font-semibold text-foreground">Investment Portfolio</h1>
                <p className="text-xs text-muted-foreground">Manage and track your investments</p>
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
                  <p className="text-xs text-muted-foreground font-medium">Portfolio Companies</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">16</p>
                  <p className="text-xs text-muted-foreground mt-2">Active investments</p>
                </div>
                <Target className="text-primary opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-secondary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Capital Invested</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">$2.4M</p>
                  <p className="text-xs text-green-600 mt-2">↑ 8% this month</p>
                </div>
                <DollarSign className="text-secondary opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-accent">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Portfolio Return</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">+48.5%</p>
                  <p className="text-xs text-green-600 mt-2">Average across portfolio</p>
                </div>
                <TrendingUp className="text-accent opacity-60" size={20} />
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-primary">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">New Opportunities</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">12</p>
                  <p className="text-xs text-muted-foreground mt-2">Open for investment</p>
                </div>
                <Zap className="text-primary opacity-60" size={20} />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Distribution */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-foreground">Portfolio by Stage</h2>
                <p className="text-xs text-muted-foreground">Investment distribution</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid #e0e0e0', fontSize: '12px' }} />
                  <Bar dataKey="companies" fill="#00d9ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Sector Distribution */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-foreground">Sector Allocation</h2>
                <p className="text-xs text-muted-foreground">Portfolio breakdown</p>
              </div>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={sectorData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {sectorData.map(sector => (
                    <div key={sector.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }} />
                      <span className="text-xs text-muted-foreground">{sector.name}: {sector.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Opportunities */}
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-foreground">Investment Opportunities</h2>
              <p className="text-xs text-muted-foreground">Top opportunities matching your criteria</p>
            </div>
            <div className="space-y-3">
              {opportunities.map(opp => (
                <div key={opp.id} className="flex items-center justify-between p-4 border border-border rounded hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{opp.startup}</p>
                    <div className="flex gap-3 mt-1">
                      <Badge variant="outline" className="text-xs">{opp.sector}</Badge>
                      <Badge variant="outline" className="text-xs">{opp.stage}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{opp.amount}</p>
                    <p className="text-xs text-green-600 mt-1">{opp.roi}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

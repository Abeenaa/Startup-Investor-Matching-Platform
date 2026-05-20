'use client'

import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

const returnsData = [
  { month: 'Jan', value: 100000 },
  { month: 'Feb', value: 120000 },
  { month: 'Mar', value: 145000 },
  { month: 'Apr', value: 168000 },
  { month: 'May', value: 195000 },
  { month: 'Jun', value: 235000 },
  { month: 'Jul', value: 280000 },
]

const portfolio = [
  {
    id: 1,
    company: 'FintechPro',
    invested: '$50,000',
    currentValue: '$125,000',
    roi: '+150%',
    status: 'Growing',
  },
  {
    id: 2,
    company: 'HealthTrack',
    invested: '$150,000',
    currentValue: '$450,000',
    roi: '+200%',
    status: 'Strong',
  },
  {
    id: 3,
    company: 'EduNext',
    invested: '$75,000',
    currentValue: '$180,000',
    roi: '+140%',
    status: 'Growing',
  },
  {
    id: 4,
    company: 'AgriFlow',
    invested: '$25,000',
    currentValue: '$65,000',
    roi: '+160%',
    status: 'Growing',
  },
  {
    id: 5,
    company: 'LogisticHub',
    invested: '$200,000',
    currentValue: '$800,000',
    roi: '+300%',
    status: 'Excellent',
  },
]

export default function ReturnsPage() {
  const totalInvested = 500000
  const totalValue = 1620000
  const totalReturn = totalValue - totalInvested
  const roi = ((totalReturn / totalInvested) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Investment Returns</h1>
        <p className="text-xs text-muted-foreground mt-1">Track your portfolio performance and returns</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground font-medium">Total Invested</p>
          <p className="text-2xl font-semibold text-foreground mt-1">${(totalInvested / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-secondary">
          <p className="text-xs text-muted-foreground font-medium">Current Value</p>
          <p className="text-2xl font-semibold text-foreground mt-1">${(totalValue / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-accent">
          <p className="text-xs text-muted-foreground font-medium">Total Returns</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">${(totalReturn / 1000).toFixed(0)}K</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-muted-foreground font-medium">Overall ROI</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">+{roi}%</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Portfolio Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={returnsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e0e0e0' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#28C3BE" 
              fill="#28C3BE" 
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Portfolio Breakdown */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Portfolio Companies</h2>
        <div className="space-y-3">
          {portfolio.map(company => (
            <div key={company.id} className="flex items-center justify-between p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{company.company}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">Invested: {company.invested}</span>
                  <span className="text-xs text-muted-foreground">Current: {company.currentValue}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">{company.roi}</p>
                <p className="text-xs text-muted-foreground mt-1">{company.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

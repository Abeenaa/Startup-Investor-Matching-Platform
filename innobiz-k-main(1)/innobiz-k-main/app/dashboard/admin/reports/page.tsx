'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, Calendar } from 'lucide-react'

const chartData = [
  { month: 'Jan', applications: 45, approved: 12, rejected: 8 },
  { month: 'Feb', applications: 52, approved: 16, rejected: 10 },
  { month: 'Mar', applications: 38, approved: 14, rejected: 6 },
  { month: 'Apr', applications: 61, approved: 18, rejected: 12 },
  { month: 'May', applications: 55, approved: 15, rejected: 9 },
]

const programData = [
  { name: 'Seed Accelerator', value: 120 },
  { name: 'Growth Fund', value: 85 },
  { name: 'Mentorship', value: 45 },
  { name: 'Other', value: 30 },
]

const COLORS = ['#28C3BE', '#056EDC', '#FFC300', '#FF8700']

export default function ReportsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">Platform performance and metrics</p>
        </div>
        <Button className="text-xs h-9 bg-primary hover:bg-primary/90">
          <Download size={14} className="mr-2" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Total Applications</p>
          <p className="text-2xl font-semibold text-foreground mt-2">342</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Approval Rate</p>
          <p className="text-2xl font-semibold text-foreground mt-2">45%</p>
          <p className="text-xs text-muted-foreground mt-1">Overall success rate</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground font-medium">Avg Review Time</p>
          <p className="text-2xl font-semibold text-foreground mt-2">5.2 days</p>
          <p className="text-xs text-green-600 mt-1">↓ 0.8 days improvement</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Applications Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e0e0e0' }} />
            <Line type="monotone" dataKey="applications" stroke="#28C3BE" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Application Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e0e0e0' }} />
              <Bar dataKey="approved" fill="#28C3BE" />
              <Bar dataKey="rejected" fill="#FF8700" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Applications by Program</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={programData} cx="50%" cy="50%" labelLine={false} label={{ fontSize: 12 }} outerRadius={80} fill="#8884d8" dataKey="value">
                {programData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '6px', border: '1px solid #e0e0e0' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="pb-4 border-b border-border sm:border-0">
            <p className="text-xs text-muted-foreground">Average Score</p>
            <p className="text-xl font-semibold text-foreground mt-1">7.8/10</p>
          </div>
          <div className="pb-4 border-b border-border sm:border-0">
            <p className="text-xs text-muted-foreground">Total Reviewers</p>
            <p className="text-xl font-semibold text-foreground mt-1">24</p>
          </div>
          <div className="pb-4 border-b border-border sm:border-0">
            <p className="text-xs text-muted-foreground">Active Programs</p>
            <p className="text-xl font-semibold text-foreground mt-1">8</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Review Completion Rate</p>
            <p className="text-xl font-semibold text-foreground mt-1">92%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

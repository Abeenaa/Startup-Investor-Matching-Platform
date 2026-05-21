'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp } from 'lucide-react'

const companies = [
  { id: 1, name: 'TechStart Ethiopia', sector: 'FinTech', stage: 'Seed', invested: '$50K', valuation: '$500K', status: 'Active' },
  { id: 2, name: 'AgriTech Solutions', sector: 'AgriTech', stage: 'Series A', invested: '$200K', valuation: '$2M', status: 'Active' },
  { id: 3, name: 'EdHub Africa', sector: 'EdTech', stage: 'Seed', invested: '$75K', valuation: '$750K', status: 'Active' },
  { id: 4, name: 'HealthVenture', sector: 'HealthTech', stage: 'Series A', invested: '$150K', valuation: '$1.5M', status: 'Active' },
]

export default function PortfolioPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Your Portfolio</h1>
          <p className="text-xs text-muted-foreground">View and manage your investments</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Company</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Sector</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Stage</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Invested</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Valuation</th>
              <th className="text-left py-3 px-4 font-medium text-xs text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => (
              <tr key={company.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="py-3 px-4 font-medium text-foreground">{company.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{company.sector}</td>
                <td className="py-3 px-4 text-muted-foreground">{company.stage}</td>
                <td className="py-3 px-4 font-medium text-primary">{company.invested}</td>
                <td className="py-3 px-4 text-foreground">{company.valuation}</td>
                <td className="py-3 px-4">
                  <Badge className="bg-green-100 text-green-700">{company.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

const criteria = [
  { category: 'Team & Leadership', weight: '25%', description: 'Evaluate team experience, expertise, and leadership quality' },
  { category: 'Business Model', weight: '20%', description: 'Assess market fit, revenue model, and sustainability' },
  { category: 'Market Opportunity', weight: '20%', description: 'Evaluate market size, growth potential, and competitive landscape' },
  { category: 'Innovation & Technology', weight: '15%', description: 'Assess product innovation, technical feasibility, and differentiation' },
  { category: 'Traction & Metrics', weight: '15%', description: 'Review growth metrics, user acquisition, and business milestones' },
  { category: 'Risk Assessment', weight: '5%', description: 'Identify potential risks and mitigation strategies' },
]

export default function ScoringPage() {
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
          <h1 className="text-xl font-semibold text-foreground">Scoring Criteria</h1>
          <p className="text-xs text-muted-foreground">Guidelines for evaluating startups</p>
        </div>
      </div>

      <Card className="p-6 bg-primary/5 border-l-4 border-l-primary">
        <h3 className="font-semibold text-foreground mb-2">Total Score: 0-100</h3>
        <p className="text-xs text-muted-foreground">Each criterion is weighted and combined to produce a comprehensive evaluation score.</p>
      </Card>

      <div className="space-y-4">
        {criteria.map((crit, idx) => (
          <Card key={idx} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{crit.category}</h3>
              </div>
              <div className="px-3 py-1 bg-accent/10 rounded text-xs font-semibold text-accent">
                {crit.weight}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{crit.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5 bg-secondary/5 border-l-4 border-l-secondary">
        <h4 className="font-semibold text-foreground text-sm mb-2">Evaluation Guidelines</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>Score each criterion from 0-10 independently</li>
          <li>Consider the startup's stage and maturity level</li>
          <li>Provide specific feedback for improvement areas</li>
          <li>Declare any conflicts of interest before scoring</li>
          <li>Ensure scores are fair and unbiased</li>
        </ul>
      </Card>
    </div>
  )
}

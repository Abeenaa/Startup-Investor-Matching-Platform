'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, BookOpen, MessageSquare, Mail } from 'lucide-react'

const faqs = [
  {
    question: 'How long do I have to complete a review?',
    answer: 'You typically have 7 days from the time an application is assigned to you. If you need more time, you can request an extension through the dashboard.',
  },
  {
    question: 'What scoring criteria should I use?',
    answer: 'Refer to the Scoring Guide in the main menu for detailed criteria. Scores are based on market potential, team quality, innovation, and business model viability.',
  },
  {
    question: 'Can I change my score after submission?',
    answer: 'No, scores are locked after submission. However, you can contact support if you discover a critical error within 24 hours of submission.',
  },
  {
    question: 'How do conflict of interest declarations work?',
    answer: 'If you have a conflict with a startup, declare it before reviewing. You will be excluded from that startup\'s evaluation to ensure fairness.',
  },
  {
    question: 'What if I have questions about an application?',
    answer: 'You can add comments and questions in the evaluation form. The startup may respond to clarify information before you finalize your score.',
  },
]

const resources = [
  { title: 'Scoring Criteria Guide', icon: BookOpen, description: 'Detailed framework for evaluating startups' },
  { title: 'Review Best Practices', icon: BookOpen, description: 'Tips for conducting thorough evaluations' },
  { title: 'Contact Support', icon: Mail, description: 'Reach out to the review team for assistance' },
]

export default function HelpPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Help & Support</h1>
        <p className="text-xs text-muted-foreground mt-1">Find answers to common questions and access resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, i) => {
          const Icon = resource.icon
          return (
            <Card key={i} className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
              <Icon className="text-primary mb-3" size={20} />
              <h3 className="text-sm font-semibold text-foreground">{resource.title}</h3>
              <p className="text-xs text-muted-foreground mt-2">{resource.description}</p>
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle size={18} className="text-primary" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="pb-4 border-b border-border last:border-0">
              <p className="text-sm font-medium text-foreground mb-2">{faq.question}</p>
              <p className="text-xs text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-primary/5 border-l-4 border-l-primary">
        <h2 className="text-sm font-semibold text-foreground mb-3">Still Need Help?</h2>
        <p className="text-xs text-muted-foreground mb-4">Our support team is here to assist you with any questions or issues during the review process.</p>
        <div className="flex gap-3">
          <Button className="text-xs h-8 bg-primary hover:bg-primary/90">
            <MessageSquare size={14} className="mr-2" />
            Contact Support
          </Button>
          <Button variant="outline" className="text-xs h-8">
            <Mail size={14} className="mr-2" />
            Email Support
          </Button>
        </div>
      </Card>
    </div>
  )
}

'use client'

const stats = [
  {
    number: '500+',
    label: 'Registered Startups',
    sublabel: 'Growing ecosystem'
  },
  {
    number: '150+',
    label: 'Active Investors',
    sublabel: 'Funding opportunities'
  },
  {
    number: '50+',
    label: 'Programs',
    sublabel: 'Support initiatives'
  },
  {
    number: '$2.5M',
    label: 'Capital Deployed',
    sublabel: 'Supporting growth'
  },
]

export default function Stats() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="border-l border-primary/30 pl-6 py-2"
          >
            <div className="text-3xl font-light text-foreground mb-1">
              {stat.number}
            </div>
            <div className="text-xs font-medium text-foreground mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat.sublabel}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

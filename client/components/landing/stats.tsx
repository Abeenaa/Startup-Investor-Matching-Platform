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
    <section id="impact" className="innobiz-shell max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <div className="innobiz-panel p-8 sm:p-10">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-foreground">
              Ecosystem Impact
            </span>
            <h2 className="innobiz-title mt-5 text-4xl font-bold tracking-[-0.05em] text-foreground">
              A platform designed for measurable momentum.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted-foreground">
            We present traction the way serious ecosystem work should look: visible, structured, and easy to understand.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="border-l border-primary/30 pl-6 py-2"
            >
              <div className="innobiz-title mb-1 text-4xl font-bold text-foreground">
                {stat.number}
              </div>
              <div className="mb-1 text-sm font-medium text-foreground">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

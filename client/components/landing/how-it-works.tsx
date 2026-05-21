'use client'

const steps = [
  {
    number: '01',
    role: 'Startups',
    color: 'from-primary/20 to-primary/5 border-primary/20',
    numberColor: 'text-primary',
    steps: [
      'Register and create your startup profile',
      'Get reviewed and approved by the admin team',
      'Appear in the public startup directory',
      'Apply to funding and incubation programs',
      'Track your application status in real time',
    ],
  },
  {
    number: '02',
    role: 'Investors',
    color: 'from-secondary/20 to-secondary/5 border-secondary/20',
    numberColor: 'text-secondary',
    steps: [
      'Register as an investor and set your profile',
      'Define your investment focus and preferences',
      'Browse the verified startup directory',
      'Get AI-powered startup match recommendations',
      'Connect with startups that fit your thesis',
    ],
  },
  {
    number: '03',
    role: 'Reviewers',
    color: 'from-accent/20 to-accent/5 border-accent/20',
    numberColor: 'text-foreground',
    steps: [
      'Get assigned to program applications by staff',
      'Access your dedicated reviewer dashboard',
      'Score applications using structured criteria',
      'Submit feedback and recommendations',
      'Declare conflicts of interest when needed',
    ],
  },
  {
    number: '04',
    role: 'Administrators',
    color: 'from-muted to-muted/50 border-border',
    numberColor: 'text-muted-foreground',
    steps: [
      'Create and manage funding programs',
      'Approve startup and investor profiles',
      'Assign reviewers to applications',
      'Monitor platform activity and reports',
      'Make final decisions on applications',
    ],
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="innobiz-shell max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <div className="mb-16 text-center">
        <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          How It Works
        </span>
        <h2 className="innobiz-title mt-6 text-4xl font-bold tracking-[-0.05em] text-foreground">
          A clear path for every
          <span className="block">participant in the ecosystem.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Whether you're a founder, investor, reviewer, or administrator — the platform gives you a structured, transparent workflow.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {steps.map(step => (
          <div key={step.role} className={`rounded-[1.75rem] border bg-gradient-to-br p-7 ${step.color}`}>
            <div className="mb-5 flex items-center gap-3">
              <span className={`innobiz-title text-4xl font-bold ${step.numberColor} opacity-30`}>{step.number}</span>
              <h3 className="innobiz-title text-xl font-semibold text-foreground">{step.role}</h3>
            </div>
            <ol className="space-y-3">
              {step.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/80 text-xs font-semibold text-foreground shadow-sm">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/80">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

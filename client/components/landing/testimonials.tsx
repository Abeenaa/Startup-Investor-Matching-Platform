'use client'

const testimonials = [
  {
    quote: "Innobiz-K gave our startup the visibility we needed. Within two months of getting approved, we had three investor inquiries and secured a spot in the Seed Accelerator.",
    name: "Meron Tadesse",
    role: "Co-founder, Blue Nile Labs",
    sector: "FinTech",
    initials: "MT",
    color: "bg-primary/10 text-primary",
  },
  {
    quote: "As an investor, finding quality deal flow in Ethiopia used to rely entirely on personal networks. The platform's directory and matching system changed that completely.",
    name: "Dawit Bekele",
    role: "Partner, Nile Ventures",
    sector: "Investor",
    initials: "DB",
    color: "bg-secondary/10 text-secondary",
  },
  {
    quote: "The evaluation workflow is transparent and fair. I can see exactly where each application stands, and the conflict-of-interest system ensures integrity throughout.",
    name: "Hana Girma",
    role: "Program Reviewer",
    sector: "Reviewer",
    initials: "HG",
    color: "bg-accent/20 text-foreground",
  },
  {
    quote: "Managing 200+ applications used to be a spreadsheet nightmare. Now everything is tracked, reviewers are assigned automatically, and decisions are fully auditable.",
    name: "Yonas Alemu",
    role: "Program Manager, MInT",
    sector: "Administrator",
    initials: "YA",
    color: "bg-muted text-muted-foreground",
  },
  {
    quote: "The structured profile format forced us to articulate our value proposition clearly. It made us a better startup, not just a more visible one.",
    name: "Tigist Haile",
    role: "Founder, AgriNova Ethiopia",
    sector: "AgriTech",
    initials: "TH",
    color: "bg-green-100 text-green-700",
  },
  {
    quote: "We deployed $800K through three programs last year. The platform's reporting tools gave us the data we needed to justify continued investment in the ecosystem.",
    name: "Samuel Worku",
    role: "Director, East Africa Growth Capital",
    sector: "Investor",
    initials: "SW",
    color: "bg-purple-100 text-purple-700",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="innobiz-shell py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Success Stories
          </span>
          <h2 className="innobiz-title mt-6 text-4xl font-bold tracking-[-0.05em] text-foreground">
            Heard from across the ecosystem.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            Founders, investors, reviewers, and administrators share how Innobiz-K changed the way they work.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(t => (
            <div key={t.name} className="flex flex-col rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
              <blockquote className="flex-1 text-sm leading-7 text-foreground/80">
                "{t.quote}"
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <span className="ml-auto rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {t.sector}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

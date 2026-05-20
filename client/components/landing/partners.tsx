'use client'

export default function Partners() {
  return (
    <section className="innobiz-shell py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold tracking-[-0.05em] text-foreground">
          Trusted by
        </h2>
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4 items-center">
          {/* UNDP Logo */}
          <div className="flex items-center justify-center">
            <img src="/UNDP-Logo.png" alt="UNDP" className="h-14 w-auto" />
          </div>
          {/* KOICA Logo */}
          <div className="flex items-center justify-center">
            <img src="/koica-Logo.png" alt="KOICA" className="h-14 w-auto" />
          </div>
          {/* MInT Logo */}
          <div className="flex items-center justify-center">
            <img src="/mint-logo.jpg" alt="MInT" className="h-14 w-auto" />
          </div>
          {/* Add more partners if needed */}
        </div>
      </div>
    </section>
  )
}
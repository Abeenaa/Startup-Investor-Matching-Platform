export function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted/50" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-96 rounded-2xl bg-muted/50" />
        <div className="h-96 rounded-2xl bg-muted/50" />
      </div>
    </div>
  )
}

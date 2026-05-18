import { LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: string | number
  note: string
  icon: LucideIcon
  iconClassName?: string
}

export function StatCard({ label, value, note, icon: Icon, iconClassName = 'text-primary' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground truncate">{note}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon className={iconClassName} size={18} />
        </div>
      </div>
    </div>
  )
}

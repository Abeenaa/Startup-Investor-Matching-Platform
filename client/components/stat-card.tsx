import { LucideIcon } from 'lucide-react'
import { memo } from 'react'

type StatCardProps = {
  label: string
  value: string | number
  note: string
  icon: LucideIcon
  iconClassName?: string
}

export const StatCard = memo(function StatCard({ 
  label, 
  value, 
  note, 
  icon: Icon, 
  iconClassName = 'text-primary' 
}: StatCardProps) {
  return (
    <div className="rounded border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground truncate">{note}</p>
        </div>
        <Icon className={`${iconClassName} opacity-60`} size={20} />
      </div>
    </div>
  )
})

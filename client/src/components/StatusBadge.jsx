const styles = {
  PENDING:      { bg: '#FFC30020', color: '#b38600' },
  APPROVED:     { bg: '#28C3BE20', color: '#009BAA' },
  REJECTED:     { bg: '#ff000015', color: '#cc0000' },
  DRAFT:        { bg: '#e5e7eb',   color: '#6b7280' },
  SUBMITTED:    { bg: '#056EDC20', color: '#056EDC' },
  UNDER_REVIEW: { bg: '#FF870020', color: '#FF8700' },
}

export default function StatusBadge({ status }) {
  const s = styles[status] || { bg: '#e5e7eb', color: '#6b7280' }
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

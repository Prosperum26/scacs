type StatusBadgeProps = {
  value: string
}

function StatusBadge({ value }: StatusBadgeProps) {
  const classes =
    value === 'Granted' || value === 'Active' || value === 'Ready'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : value === 'Denied' || value === 'Suspended'
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-amber-50 text-amber-700 ring-amber-200'

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${classes}`}>{value}</span>
}

export default StatusBadge

type StatusBadgeProps = {
  value: string
}

function StatusBadge({ value }: StatusBadgeProps) {
  const normalized = value.toLowerCase()
  const classes =
    normalized === 'granted' || normalized === 'active' || normalized === 'ready'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : normalized === 'denied' || normalized === 'suspended'
        ? 'bg-rose-50 text-rose-700 ring-rose-200'
        : 'bg-amber-50 text-amber-700 ring-amber-200'

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${classes}`}>{value}</span>
}

export default StatusBadge

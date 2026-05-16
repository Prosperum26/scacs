type SeriesPoint = {
  label: string
  value: number
}

type DonutPoint = {
  label: string
  value: number
  color: string
}

export function AreaChart({ data }: { data: SeriesPoint[] }) {
  const max = Math.max(...data.map((item) => item.value), 1)
  const width = 640
  const height = 220
  const step = width / Math.max(data.length - 1, 1)
  const points = data
    .map((item, index) => {
      const x = index * step
      const y = height - (item.value / max) * 170 - 18
      return `${x},${y}`
    })
    .join(' ')
  const fillPoints = `0,${height} ${points} ${width},${height}`

  return (
    <div className="h-72 w-full overflow-hidden rounded-lg bg-slate-50 p-4">
      <svg className="h-full w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Entry volume chart">
        <defs>
          <linearGradient id="entryFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polyline points={fillPoints} fill="url(#entryFill)" stroke="none" />
        <polyline points={points} fill="none" stroke="#0891b2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        {data.map((item, index) => {
          const x = index * step
          const y = height - (item.value / max) * 170 - 18
          return <circle key={item.label} cx={x} cy={y} fill="#0f172a" r="5" />
        })}
      </svg>
      <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-slate-500 sm:grid-cols-8">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  )
}

export function DonutChart({ data }: { data: DonutPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const segments = data.reduce<Array<DonutPoint & { dash: number; offset: number }>>((items, item) => {
    const used = items.reduce((sum, segment) => sum + segment.dash, 0)
    const dash = (item.value / total) * 100

    return [...items, { ...item, dash, offset: 25 - used }]
  }, [])

  return (
    <div className="flex flex-col items-center gap-5 rounded-lg bg-slate-50 p-5 sm:flex-row">
      <svg className="size-40 -rotate-90" viewBox="0 0 42 42" role="img" aria-label="Access mix chart">
        <circle cx="21" cy="21" fill="transparent" r="15.915" stroke="#e2e8f0" strokeWidth="7" />
        {segments.map((item) => {
          const strokeDasharray = `${item.dash} ${100 - item.dash}`
          const strokeDashoffset = item.offset
          return (
            <circle
              key={item.label}
              cx="21"
              cy="21"
              fill="transparent"
              r="15.915"
              stroke={item.color}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeWidth="7"
            />
          )
        })}
      </svg>
      <div className="grid flex-1 gap-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              {item.label}
            </span>
            <span className="text-sm font-semibold text-slate-950">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

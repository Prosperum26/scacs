type StatCardProps = {
  label: string
  value: string
  change: string
  tone: string
}

function StatCard({ label, value, change, tone }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-3xl font-semibold text-slate-950">{value}</p>
        <p className={`text-sm font-semibold ${tone}`}>{change}</p>
      </div>
    </div>
  )
}

export default StatCard

type InfoProps = {
  label: string
  value: string
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}

export default Info

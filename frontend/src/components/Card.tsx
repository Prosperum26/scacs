import type { ReactNode } from 'react'

type CardProps = {
  title: string
  subtitle: string
  children: ReactNode
}

function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default Card

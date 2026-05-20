import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import type { AccessHistoryItem } from '../../types/api'

export default function History() {
  const { token } = useAuth()
  const [items, setItems] = useState<AccessHistoryItem[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [from, setFrom] = useState('')

  useEffect(() => {
    if (!token) return
    const params: Record<string, string> = {}
    if (statusFilter) params.status = statusFilter === 'Granted' ? 'GRANTED' : 'DENIED'
    if (from) params.from = from
    api.history(token, params).then(setItems).catch(console.error)
  }, [token, statusFilter, from])

  const filtered = useMemo(() => {
    if (!search) return items
    return items.filter((i) => i.gate.toLowerCase().includes(search.toLowerCase()))
  }, [items, search])

  const exportCsv = () => {
    const rows = [['Time', 'Gate', 'Status', 'Method'], ...filtered.map((i) => [i.time, i.gate, i.status, i.method])]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'access-history.csv'
    a.click()
  }

  return (
    <div className="animate-slide-up space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Access History</h1>
        <button
          type="button"
          onClick={exportCsv}
          className="tap-target w-full rounded-lg border border-cyan-500/40 px-4 py-3 text-sm text-cyan-300 hover:bg-cyan-500/10 sm:w-auto sm:py-2"
        >
          Export CSV
        </button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <input
          placeholder="Search gate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tap-target w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-base sm:max-w-xs sm:py-2 sm:text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="tap-target w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-3 text-base sm:w-auto sm:max-w-[10rem] sm:py-2 sm:text-sm"
        >
          <option value="">All status</option>
          <option value="Granted">Granted</option>
          <option value="Denied">Denied</option>
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="tap-target w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-3 text-base sm:w-auto sm:py-2 sm:text-sm"
        />
      </div>

      {/* Mobile: stacked cards */}
      <ul className="space-y-3 md:hidden">
        {filtered.map((row) => (
          <li key={row.id} className="glass rounded-xl p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-slate-500">{new Date(row.time).toLocaleString()}</p>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  row.status === 'Granted' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}
              >
                {row.status}
              </span>
            </div>
            <p className="mt-2 font-semibold text-white">{row.gate}</p>
            <p className="mt-1 text-xs text-slate-400">Method: {row.method}</p>
          </li>
        ))}
      </ul>

      {/* Tablet+ : table */}
      <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Gate</th>
              <th className="p-3">Status</th>
              <th className="p-3">Method</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-t border-white/5">
                <td className="p-3 whitespace-nowrap">{new Date(row.time).toLocaleString()}</td>
                <td className="p-3">{row.gate}</td>
                <td className={`p-3 font-semibold ${row.status === 'Granted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {row.status}
                </td>
                <td className="p-3">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

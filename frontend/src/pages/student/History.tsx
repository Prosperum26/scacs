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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">Access History</h1>
        <button type="button" onClick={exportCsv} className="rounded-lg border border-cyan-500/40 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/10">
          Export CSV
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search gate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="Granted">Granted</option>
          <option value="Denied">Denied</option>
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
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
                <td className="p-3">{new Date(row.time).toLocaleString()}</td>
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

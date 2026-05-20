import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import type { Analytics } from '../../types/api'

export default function Analytics() {
  const { token } = useAuth()
  const [data, setData] = useState<Analytics | null>(null)

  useEffect(() => {
    if (!token) return
    api.analytics(token).then(setData).catch(console.error)
  }, [token])

  if (!data) return <p className="text-slate-500">Loading analytics...</p>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-500">Daily check-ins</p>
          <p className="text-2xl font-bold text-emerald-400">{data.dailyCheckIns}</p>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-500">Denied today</p>
          <p className="text-2xl font-bold text-rose-500">{data.deniedToday}</p>
        </div>
        <div className="rounded border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-xs text-slate-500">Active students</p>
          <p className="text-2xl font-bold text-cyan-400">{data.activeStudents}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded border border-slate-800 p-4">
          <h3 className="mb-4 text-sm text-slate-400">Peak access hours</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.hourlyStats}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="hour" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="granted" fill="#10b981" name="Granted" />
              <Bar dataKey="denied" fill="#f43f5e" name="Denied" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded border border-slate-800 p-4">
          <h3 className="mb-4 text-sm text-slate-400">7-day trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.dailyTrend}>
              <CartesianGrid stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

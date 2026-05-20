import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import type { StudentDashboard as DashboardData } from '../../types/api'

export default function StudentDashboard() {
  const { token, user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    if (!token) return
    api.studentDashboard(token).then(setData).catch(console.error)
  }, [token])

  const stats = [
    { label: 'Total Check-ins', value: data?.totalCheckIns ?? '—', color: 'text-cyan-400' },
    {
      label: 'Last Access',
      value: data?.lastAccessTime ? new Date(data.lastAccessTime).toLocaleString() : 'Never',
      color: 'text-indigo-300',
    },
    { label: 'QR Status', value: data?.activeQrStatus ?? 'Ready', color: 'text-emerald-400' },
    { label: 'Access Level', value: data?.campusAccessLevel ?? user?.accessLevel ?? '—', color: 'text-violet-300' },
  ]

  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400">Welcome back, {user?.fullName}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-2 text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <Link
        to="/student/qr"
        className="block rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-6 text-center transition hover:border-cyan-400"
      >
        <p className="text-sm text-cyan-300">Tap to open your secure campus QR →</p>
      </Link>
    </div>
  )
}

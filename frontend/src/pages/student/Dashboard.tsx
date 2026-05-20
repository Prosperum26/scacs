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
        <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400 sm:text-base">Welcome back, {user?.fullName}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 sm:p-5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 sm:text-xs">{s.label}</p>
            <p className={`mt-1 break-words text-base font-bold sm:mt-2 sm:text-lg ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <Link
        to="/student/qr"
        className="tap-target flex min-h-[3.5rem] items-center justify-center rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 px-4 py-4 text-center text-sm text-cyan-300 transition hover:border-cyan-400 sm:min-h-0 sm:p-6"
      >
        <span className="font-semibold">Open my QR for gate check-in →</span>
      </Link>
    </div>
  )
}

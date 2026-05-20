import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import type { Alert } from '../../types/api'

const severityColor = { low: 'text-slate-400 border-slate-600', medium: 'text-amber-400 border-amber-600', high: 'text-rose-500 border-rose-600' }

export default function Alerts() {
  const { token } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])

  const load = () => {
    if (!token) return
    api.alerts(token).then(setAlerts).catch(console.error)
  }

  useEffect(() => {
    load()
  }, [token])

  return (
    <div>
      <h1 className="text-xl font-bold">Security Alerts</h1>
      <div className="mt-4 space-y-3">
        {alerts.map((a) => (
          <div key={a.id} className={`rounded border p-4 ${severityColor[a.severity]}`}>
            <div className="flex justify-between">
              <span className="text-xs font-bold uppercase">{a.severity}</span>
              <span className="text-xs text-slate-600">{new Date(a.createdAt).toLocaleString()}</span>
            </div>
            <h3 className="mt-1 font-semibold text-white">{a.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

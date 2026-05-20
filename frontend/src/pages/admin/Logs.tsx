import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { api } from '../../services/api'
import type { ScanResult } from '../../types/api'

export default function AdminLogs() {
  const { token } = useAuth()
  const { scanVersion } = useSocket()
  const [logs, setLogs] = useState<ScanResult[]>([])

  useEffect(() => {
    if (!token) return
    api.logs(token).then(setLogs).catch(console.error)
  }, [token, scanVersion])

  return (
    <div>
      <h1 className="text-xl font-bold">Access Logs</h1>
      <div className="mt-4 overflow-x-auto rounded border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-500">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Student</th>
              <th className="p-3">Gate</th>
              <th className="p-3">Status</th>
              <th className="p-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-slate-800">
                <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-3">{log.studentName}</td>
                <td className="p-3">{log.gate}</td>
                <td className={`p-3 font-semibold ${log.status === 'GRANTED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {log.status}
                </td>
                <td className="p-3 text-slate-500">{log.reason ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

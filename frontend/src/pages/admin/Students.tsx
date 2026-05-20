import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

type Student = { id: string; studentId: string; name: string; department: string; status: string; email: string }

export default function Students() {
  const { token } = useAuth()
  const [list, setList] = useState<Student[]>([])
  const [q, setQ] = useState('')

  const load = () => {
    if (!token) return
    api.students(token, q || undefined).then(setList).catch(console.error)
  }

  useEffect(() => {
    load()
  }, [token, q])

  const setStatus = async (id: string, status: string) => {
    if (!token) return
    await api.updateStudentStatus(token, id, status)
    load()
  }

  const resetQr = async (id: string) => {
    if (!token) return
    await api.resetQr(token, id)
    alert('QR sessions reset')
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Student Management</h1>
      <input
        placeholder="Search..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mt-4 rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
      />
      <div className="mt-4 overflow-x-auto rounded border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-500">
            <tr>
              <th className="p-3">Student ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t border-slate-800">
                <td className="p-3 font-mono">{s.studentId}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.department}</td>
                <td className="p-3 capitalize">{s.status}</td>
                <td className="p-3 space-x-2">
                  {s.status !== 'active' && (
                    <button type="button" onClick={() => setStatus(s.id, 'active')} className="text-xs text-emerald-500">
                      Enable
                    </button>
                  )}
                  {s.status === 'active' && (
                    <button type="button" onClick={() => setStatus(s.id, 'suspended')} className="text-xs text-amber-500">
                      Disable
                    </button>
                  )}
                  <button type="button" onClick={() => resetQr(s.id)} className="text-xs text-cyan-500">
                    Reset QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

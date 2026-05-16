import { useMemo, useState } from 'react'
import Card from '../components/Card'
import Info from '../components/Info'
import { users } from '../data/mockData'

type ScanState = 'idle' | 'granted' | 'denied'

function Scanner() {
  const [studentId, setStudentId] = useState('SV2026001')
  const [scanState, setScanState] = useState<ScanState>('idle')

  const mockUser = useMemo(
    () => users.find((user) => user.id.toLowerCase() === studentId.trim().toLowerCase()),
    [studentId],
  )

  const runScan = () => {
    setScanState(mockUser && mockUser.status === 'Active' ? 'granted' : 'denied')
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <Card title="Credential Scanner" subtitle="Mock student ID and QR access check">
        <div className="space-y-5 pt-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Student ID</span>
            <input
              value={studentId}
              onChange={(event) => {
                setStudentId(event.target.value)
                setScanState('idle')
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="Enter ID, e.g. SV2026001"
            />
          </label>
          <button
            type="button"
            onClick={runScan}
            className="w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Scan QR
          </button>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div className="mx-auto grid size-36 place-items-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500">
              QR MOCK
            </div>
          </div>
        </div>
      </Card>
      <div
        className={`rounded-lg border p-6 shadow-sm ${
          scanState === 'granted'
            ? 'border-emerald-200 bg-emerald-50'
            : scanState === 'denied'
              ? 'border-rose-200 bg-rose-50'
              : 'border-slate-200 bg-white'
        }`}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Scan Result</p>
        <h2
          className={`mt-4 text-4xl font-bold ${
            scanState === 'granted' ? 'text-emerald-700' : scanState === 'denied' ? 'text-rose-700' : 'text-slate-400'
          }`}
        >
          {scanState === 'idle' ? 'AWAITING SCAN' : scanState === 'granted' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Info label="Credential" value={studentId || 'No ID entered'} />
          <Info label="Name" value={mockUser?.name ?? 'Unknown'} />
          <Info label="Role" value={mockUser?.role ?? 'Not registered'} />
          <Info label="Gate" value="Main Gate A" />
        </div>
      </div>
    </div>
  )
}

export default Scanner

import { useState } from 'react'
import Card from '../components/Card'
import Info from '../components/Info'
import { useDemo } from '../context/demoContext'
import { apiClient } from '../services/apiClient'
import type { VerifyAccessResponse } from '../types/api'

type ScanState = 'idle' | 'granted' | 'denied'

const demoUsers = [
  { id: 'SV2026001', label: 'Student Active' },
  { id: 'FC1108', label: 'Faculty Active' },
  { id: 'ST3302', label: 'Suspended Staff' },
  { id: 'VISITOR-404', label: 'Unknown ID' },
]

function Scanner() {
  const [studentId, setStudentId] = useState('SV2026001')
  const [lastCredential, setLastCredential] = useState('SV2026001')
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [scanResult, setScanResult] = useState<VerifyAccessResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { addActivity, pushToast } = useDemo()

  const runScan = async () => {
    const credential = studentId.trim()

    if (!credential) {
      setError('Student ID is required')
      pushToast({ title: 'Missing credential', message: 'Enter or choose a demo student ID before scanning.', tone: 'error' })
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setScanState('idle')
      setLastCredential(credential)
      const result = await apiClient.verifyAccess(credential)
      const nextState = result.result === 'GRANTED' ? 'granted' : 'denied'
      setScanResult(result)
      setScanState(nextState)
      setStudentId('')
      addActivity({
        name: result.user?.name ?? 'Unknown',
        userId: credential,
        gate: result.log.gate,
        result: result.result,
      })
      pushToast({
        title: result.result === 'GRANTED' ? 'Access granted' : 'Access denied',
        message: `${credential} checked at ${result.log.gate}.`,
        tone: result.result === 'GRANTED' ? 'success' : 'error',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify access'
      setError(message)
      setScanState('denied')
      setScanResult(null)
      pushToast({ title: 'Scanner error', message, tone: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <Card title="Credential Scanner" subtitle="Demo-ready student ID and QR access check">
        <div className="space-y-5 pt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setStudentId(user.id)
                  setScanState('idle')
                  setScanResult(null)
                  setError('')
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50"
              >
                <span className="block text-slate-950">{user.id}</span>
                {user.label}
              </button>
            ))}
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Student ID</span>
            <input
              value={studentId}
              onChange={(event) => {
                setStudentId(event.target.value)
                setScanState('idle')
                setScanResult(null)
                setError('')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  runScan()
                }
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="Enter ID, e.g. SV2026001"
            />
          </label>
          <button
            type="button"
            onClick={runScan}
            disabled={isLoading}
            className="w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {isLoading ? 'Scanning...' : 'Scan QR'}
          </button>
          {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
          <div className={`rounded-lg border border-dashed p-6 text-center transition ${isLoading ? 'border-cyan-300 bg-cyan-50' : 'border-slate-300 bg-slate-50'}`}>
            <div className="mx-auto grid size-36 place-items-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 shadow-inner">
              {isLoading ? 'VERIFYING' : 'QR MOCK'}
            </div>
          </div>
        </div>
      </Card>
      <div
        className={`rounded-lg border p-6 shadow-sm transition-all duration-300 ${
          scanState === 'granted'
            ? 'border-emerald-200 bg-emerald-50 shadow-emerald-100'
            : scanState === 'denied'
              ? 'border-rose-200 bg-rose-50 shadow-rose-100'
              : 'border-slate-200 bg-white'
        }`}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Scan Result</p>
        <h2
          className={`mt-4 text-4xl font-bold ${scanState !== 'idle' ? 'animate-result-pop' : ''} ${
            scanState === 'granted' ? 'text-emerald-700' : scanState === 'denied' ? 'text-rose-700' : 'text-slate-400'
          }`}
        >
          {scanState === 'idle' ? 'AWAITING SCAN' : scanState === 'granted' ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Info label="Credential" value={scanResult?.log.userId ?? lastCredential} />
          <Info label="Name" value={scanResult?.user?.name ?? 'Unknown'} />
          <Info label="Role" value={scanResult?.user?.role ?? 'Not registered'} />
          <Info label="Gate" value={scanResult?.log.gate ?? 'Main Gate A'} />
        </div>
      </div>
    </div>
  )
}

export default Scanner

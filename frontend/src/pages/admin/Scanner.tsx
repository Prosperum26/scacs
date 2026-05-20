import { useCallback, useEffect, useRef, useState } from 'react'
import QrCameraScanner from '../../components/admin/QrCameraScanner'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import { api } from '../../services/api'
import type { ScanResult } from '../../types/api'

const GATES = ['Main Gate', 'Library', 'Dormitory', 'Parking Area', 'Laboratory Building']

function computeQrBox(windowWidth: number) {
  return Math.min(Math.max(Math.floor(windowWidth * 0.75), 240), 420)
}

export default function Scanner() {
  const { token } = useAuth()
  const windowWidth = useWindowWidth()
  const qrBox = computeQrBox(windowWidth)
  const { lastScan, scanVersion } = useSocket()
  const [gate, setGate] = useState(GATES[0])
  const gateRef = useRef(gate)
  gateRef.current = gate

  const [result, setResult] = useState<ScanResult | null>(null)
  const [recent, setRecent] = useState<ScanResult[]>([])
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [shake, setShake] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const processing = useRef(false)

  const loadLogs = useCallback(() => {
    if (!token) return
    api
      .logs(token)
      .then((rows) => setRecent(Array.isArray(rows) ? rows : []))
      .catch(console.error)
  }, [token])

  useEffect(() => {
    loadLogs()
  }, [loadLogs, scanVersion])

  useEffect(() => {
    if (!lastScan) return
    setResult(normalizeScan(lastScan))
    if (lastScan.status === 'DENIED') {
      setShake(true)
      const t = window.setTimeout(() => setShake(false), 500)
      return () => window.clearTimeout(t)
    }
  }, [lastScan])

  const applyScanResult = useCallback((res: ScanResult) => {
    setResult(normalizeScan(res))
    if (res.status === 'DENIED') {
      setShake(true)
      window.setTimeout(() => setShake(false), 500)
    }
  }, [])

  const handleScan = useCallback(
    async (qrToken: string) => {
      if (!token || processing.current) return
      const payload = qrToken.trim()
      if (!payload) return
      processing.current = true
      try {
        const res = await api.verifyQr(token, payload, gateRef.current)
        applyScanResult(res)
        loadLogs()
      } catch (e) {
        console.error(e)
      } finally {
        window.setTimeout(() => {
          processing.current = false
        }, 1500)
      }
    },
    [token, loadLogs, applyScanResult],
  )

  const submitManual = () => {
    if (!manualCode.trim()) return
    const code = manualCode.trim()
    handleScan(code.startsWith('SC:') ? code : `SC:${code.replace(/^SC:/i, '')}`)
  }

  const granted = result?.status === 'GRANTED'

  return (
    <div className="space-y-6 text-slate-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-white sm:text-xl">Live QR Scanner</h1>
          <p className="text-xs text-slate-500">
            Optimized for laptop webcam · scan student phone at 25–40cm, good lighting
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <select
            value={gate}
            onChange={(e) => setGate(e.target.value)}
            className="tap-target w-full rounded border border-slate-800 bg-slate-900 px-3 py-3 text-base text-slate-100 sm:w-auto sm:py-2 sm:text-sm"
          >
            {GATES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setCameraError('')
              setCameraOn((on) => !on)
            }}
            className={`tap-target w-full rounded px-4 py-3 text-sm font-semibold sm:w-auto sm:py-2 ${cameraOn ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
          >
            {cameraOn ? 'Stop camera' : 'Start camera'}
          </button>
        </div>
      </div>

      {cameraError && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-950/40 px-4 py-2 text-sm text-amber-200">
          {cameraError}
        </p>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="scanner-panel relative overflow-hidden rounded-lg border border-slate-800 bg-black">
          <QrCameraScanner
            active={cameraOn}
            qrBox={qrBox}
            onScan={handleScan}
            onError={(msg) => {
              setCameraError(msg)
              setCameraOn(false)
            }}
          />
          {!cameraOn && (
            <div className="absolute inset-0 grid place-items-center bg-black px-4 text-center text-slate-500">
              <p>
                Start camera, then ask the student to open{' '}
                <strong className="text-slate-300">Scan mode (fullscreen)</strong> on their phone.
              </p>
            </div>
          )}
          {cameraOn && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="rounded-lg border-2 border-dashed border-emerald-400/70 shadow-[0_0_24px_rgba(52,211,153,0.25)]"
                style={{
                  width: Math.min(qrBox, 360),
                  height: Math.min(qrBox, 360),
                  maxWidth: '92%',
                  maxHeight: '85%',
                }}
              />
            </div>
          )}
          <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 text-xs text-emerald-400">
            <span className={`size-2 rounded-full ${cameraOn ? 'animate-pulse bg-emerald-400' : 'bg-slate-600'}`} />
            LIVE
          </span>
        </div>

        <div
          className={`rounded-lg border p-6 transition-all ${shake ? 'animate-shake' : ''} ${
            result
              ? granted
                ? 'border-emerald-500/50 bg-emerald-950/40'
                : 'border-rose-500/50 bg-rose-950/40'
              : 'border-slate-800 bg-slate-900/50'
          }`}
        >
          <p className="text-xs uppercase tracking-widest text-slate-500">Scan result</p>
          <h2
            className={`mt-2 text-2xl font-black sm:text-3xl ${granted ? 'text-emerald-400' : result ? 'text-rose-500' : 'text-slate-600'}`}
          >
            {result ? (granted ? 'ACCESS GRANTED ✅' : 'ACCESS DENIED ❌') : 'AWAITING SCAN'}
          </h2>
          {result && (
            <div className="mt-6 flex items-center gap-4">
              {result.user?.avatarUrl ? (
                <img
                  src={result.user.avatarUrl}
                  alt=""
                  className="size-16 rounded-lg border border-white/10 bg-slate-800"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
              <div className="min-w-0">
                <p className="font-bold text-white">{result.studentName ?? 'Unknown'}</p>
                <p className="text-sm text-slate-400">{result.studentId ?? '—'}</p>
                <p className="text-xs text-slate-500">
                  {formatTime(result.timestamp)} · {result.gate ?? gate}
                </p>
                {!granted && result.reason ? (
                  <p className="mt-1 text-sm text-rose-400">{result.reason}</p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Manual code (backup)</h3>
        <p className="mt-1 text-xs text-slate-500">
          If the camera fails, paste the short code from the student app (under QR).
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="SC:abc123def456 or 12-char code"
            className="tap-target flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm text-slate-100"
          />
          <button
            type="button"
            onClick={submitManual}
            className="tap-target rounded bg-slate-700 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-600"
          >
            Verify code
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-400">Recent scans</h3>
        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-500">
              <tr>
                <th className="p-2">Time</th>
                <th className="p-2">Student</th>
                <th className="p-2">Gate</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.slice(0, 15).map((log, index) => (
                <tr key={log.id ?? `log-${index}`} className="border-t border-slate-800">
                  <td className="p-2">{formatTime(log.timestamp)}</td>
                  <td className="p-2">{log.studentName ?? '—'}</td>
                  <td className="p-2">{log.gate ?? '—'}</td>
                  <td className={`p-2 font-bold ${log.status === 'GRANTED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {log.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function formatTime(value: string | Date | undefined): string {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString()
}

function normalizeScan(raw: ScanResult): ScanResult {
  return {
    ...raw,
    timestamp:
      typeof raw.timestamp === 'string'
        ? raw.timestamp
        : raw.timestamp != null
          ? new Date(raw.timestamp as unknown as string).toISOString()
          : new Date().toISOString(),
    studentName: raw.studentName ?? raw.user?.fullName ?? 'Unknown',
    studentId: raw.studentId ?? raw.user?.studentId ?? '—',
  }
}

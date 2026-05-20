import { useCallback, useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { api } from '../../services/api'
import type { ScanResult } from '../../types/api'

const GATES = ['Main Gate', 'Library', 'Dormitory', 'Parking Area', 'Laboratory Building']

export default function Scanner() {
  const { token } = useAuth()
  const { lastScan, scanVersion } = useSocket()
  const [gate, setGate] = useState(GATES[0])
  const [result, setResult] = useState<ScanResult | null>(null)
  const [recent, setRecent] = useState<ScanResult[]>([])
  const [cameraOn, setCameraOn] = useState(false)
  const [shake, setShake] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const processing = useRef(false)

  const loadLogs = useCallback(() => {
    if (!token) return
    api.logs(token).then(setRecent).catch(console.error)
  }, [token])

  useEffect(() => {
    loadLogs()
  }, [loadLogs, scanVersion])

  useEffect(() => {
    if (lastScan) {
      setResult(lastScan)
      if (lastScan.status === 'DENIED') {
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    }
  }, [lastScan])

  const handleScan = useCallback(
    async (qrToken: string) => {
      if (!token || processing.current) return
      processing.current = true
      try {
        const res = await api.verifyQr(token, qrToken, gate)
        setResult(res)
        if (res.status === 'DENIED') {
          setShake(true)
          setTimeout(() => setShake(false), 500)
        }
        loadLogs()
      } catch (e) {
        console.error(e)
      } finally {
        setTimeout(() => {
          processing.current = false
        }, 2000)
      }
    },
    [token, gate, loadLogs],
  )

  useEffect(() => {
    if (!cameraOn) return

    const id = 'qr-reader'
    const scanner = new Html5Qrcode(id)
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 280 } },
        (decoded) => handleScan(decoded),
        () => {},
      )
      .catch(() => setCameraOn(false))

    return () => {
      scanner.stop().catch(() => {})
      scannerRef.current = null
    }
  }, [cameraOn, handleScan])

  const granted = result?.status === 'GRANTED'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Live QR Scanner</h1>
          <p className="text-xs text-slate-500">Real-time campus access verification</p>
        </div>
        <select
          value={gate}
          onChange={(e) => setGate(e.target.value)}
          className="rounded border border-slate-800 bg-slate-900 px-3 py-2 text-sm"
        >
          {GATES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setCameraOn(!cameraOn)}
          className={`rounded px-4 py-2 text-sm font-semibold ${cameraOn ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}
        >
          {cameraOn ? 'Stop camera' : 'Start camera'}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-black">
          {cameraOn && <div id="qr-reader" className="min-h-[320px] w-full" />}
          {!cameraOn && (
            <div className="grid min-h-[320px] place-items-center text-slate-600">
              <p>Camera off — click Start camera</p>
            </div>
          )}
          {cameraOn && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="size-64 border-2 border-emerald-400/60" />
              <div className="absolute left-0 right-0 h-0.5 animate-pulse bg-emerald-400/80" style={{ animation: 'scan-line 2s linear infinite' }} />
            </div>
          )}
          <span className="absolute right-3 top-3 flex items-center gap-1 text-xs text-emerald-400">
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
          <h2 className={`mt-2 text-3xl font-black ${granted ? 'text-emerald-400' : result ? 'text-rose-500' : 'text-slate-600'}`}>
            {result ? (granted ? 'ACCESS GRANTED ✅' : 'ACCESS DENIED ❌') : 'AWAITING SCAN'}
          </h2>
          {result && (
            <div className="mt-6 flex items-center gap-4">
              {result.user?.avatarUrl && (
                <img src={result.user.avatarUrl} alt="" className="size-16 rounded-lg border border-white/10" />
              )}
              <div>
                <p className="font-bold text-white">{result.studentName}</p>
                <p className="text-sm text-slate-400">{result.studentId}</p>
                <p className="text-xs text-slate-500">{new Date(result.timestamp).toLocaleString()} · {result.gate}</p>
                {!granted && result.reason && <p className="mt-1 text-sm text-rose-400">{result.reason}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-400">Recent scans</h3>
        <div className="overflow-x-auto rounded border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-500">
              <tr>
                <th className="p-2">Time</th>
                <th className="p-2">Student</th>
                <th className="p-2">Gate</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.slice(0, 15).map((log) => (
                <tr key={log.id} className="border-t border-slate-800">
                  <td className="p-2">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-2">{log.studentName}</td>
                  <td className="p-2">{log.gate}</td>
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

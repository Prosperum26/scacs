import { useCallback, useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import { api } from '../../services/api'
import type { ScanResult } from '../../types/api'

const GATES = ['Main Gate', 'Library', 'Dormitory', 'Parking Area', 'Laboratory Building']

/** Laptop webcams: user-facing camera, higher resolution, larger scan region. */
function scannerConfig(windowWidth: number) {
  const qrBox = Math.min(Math.max(Math.floor(windowWidth * 0.75), 240), 420)
  return {
    qrBox,
    fps: 15,
    aspectRatio: 1,
    disableFlip: false,
    videoConstraints: {
      facingMode: 'user',
      width: { ideal: 1280, min: 640 },
      height: { ideal: 720, min: 480 },
    },
  }
}

export default function Scanner() {
  const { token } = useAuth()
  const windowWidth = useWindowWidth()
  const { qrBox, fps, aspectRatio, disableFlip, videoConstraints } = scannerConfig(windowWidth)
  const { lastScan, scanVersion } = useSocket()
  const [gate, setGate] = useState(GATES[0])
  const [result, setResult] = useState<ScanResult | null>(null)
  const [recent, setRecent] = useState<ScanResult[]>([])
  const [cameraOn, setCameraOn] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [shake, setShake] = useState(false)
  const [manualCode, setManualCode] = useState('')
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
      const payload = qrToken.trim()
      if (!payload) return
      processing.current = true
      try {
        const res = await api.verifyQr(token, payload, gate)
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
        }, 1500)
      }
    },
    [token, gate, loadLogs],
  )

  const submitManual = () => {
    if (!manualCode.trim()) return
    handleScan(manualCode.startsWith('SC:') ? manualCode : `SC:${manualCode.replace(/^SC:/i, '')}`)
  }

  useEffect(() => {
    if (!cameraOn) return

    const id = 'qr-reader'
    const scanner = new Html5Qrcode(id, { verbose: false })
    scannerRef.current = scanner
    setCameraError('')

    const startWithCamera = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras()
        const laptopCam =
          cameras.find((c) => /facetime|integrated|built.?in|webcam|user/i.test(c.label)) ??
          cameras[0]

        const cameraIdOrConfig = laptopCam?.id ?? { facingMode: 'user' as const }

        await scanner.start(
          cameraIdOrConfig,
          {
            fps,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const size = Math.min(qrBox, viewfinderWidth * 0.92, viewfinderHeight * 0.85)
              return { width: size, height: size }
            },
            aspectRatio,
            disableFlip,
            videoConstraints,
          },
          (decoded) => handleScan(decoded),
          () => {},
        )
      } catch (err) {
        console.error(err)
        setCameraError('Could not start camera. Allow permission or try manual code below.')
        setCameraOn(false)
      }
    }

    startWithCamera()

    return () => {
      scanner.stop().catch(() => {})
      scannerRef.current = null
    }
  }, [cameraOn, handleScan, qrBox, fps, aspectRatio, disableFlip, videoConstraints])

  const granted = result?.status === 'GRANTED'

  return (
    <div className="space-y-6">
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
            className="tap-target w-full rounded border border-slate-800 bg-slate-900 px-3 py-3 text-base sm:w-auto sm:py-2 sm:text-sm"
          >
            {GATES.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setCameraOn(!cameraOn)}
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
          {cameraOn && <div id="qr-reader" className="min-h-[360px] w-full sm:min-h-[420px]" />}
          {!cameraOn && (
            <div className="grid min-h-[360px] place-items-center px-4 text-center text-slate-500 sm:min-h-[420px]">
              <p>
                Start camera, then ask the student to open <strong className="text-slate-300">Scan mode (fullscreen)</strong>{' '}
                on their phone.
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
          <h2
            className={`mt-2 text-2xl font-black sm:text-3xl ${granted ? 'text-emerald-400' : result ? 'text-rose-500' : 'text-slate-600'}`}
          >
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
                <p className="text-xs text-slate-500">
                  {new Date(result.timestamp).toLocaleString()} · {result.gate}
                </p>
                {!granted && result.reason && <p className="mt-1 text-sm text-rose-400">{result.reason}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <h3 className="text-sm font-semibold text-slate-300">Manual code (backup)</h3>
        <p className="mt-1 text-xs text-slate-500">If the camera fails, paste the short code from the student app (under QR).</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="SC:abc123def456 or 12-char code"
            className="tap-target flex-1 rounded border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm"
          />
          <button
            type="button"
            onClick={submitManual}
            className="tap-target rounded bg-slate-700 px-4 py-3 text-sm font-semibold hover:bg-slate-600"
          >
            Verify code
          </button>
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

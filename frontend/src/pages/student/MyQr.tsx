import { useCallback, useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import type { QrData } from '../../types/api'

export default function MyQr() {
  const { token, user } = useAuth()
  const [qr, setQr] = useState<QrData | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const data = await api.getQr(token)
      setQr(data)
      setCountdown(data.expiresInSec)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 45000)
    return () => clearInterval(interval)
  }, [refresh])

  useEffect(() => {
    if (countdown <= 0) return
    const t = setInterval(() => setCountdown((c) => (c <= 1 ? 0 : c - 1)), 1000)
    return () => clearInterval(t)
  }, [countdown, qr?.qrToken])

  const display = qr?.user ?? user

  return (
    <div className={`animate-slide-up ${fullscreen ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4' : ''}`}>
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold">My QR Code</h1>
        <p className="text-sm text-slate-400">Secure rotating campus pass · refreshes every 45s</p>

        <div className="mt-8 flex flex-col items-center">
          <div className={`qr-ring animate-pulse-glow ${loading ? 'opacity-50' : ''}`}>
            <div className="rounded-xl bg-slate-950 p-4">
              {qr?.qrToken ? (
                <QRCodeSVG value={qr.qrToken} size={fullscreen ? 280 : 220} level="H" includeMargin />
              ) : (
                <div className="grid size-[220px] place-items-center text-slate-500">Loading...</div>
              )}
            </div>
          </div>

          <p className="mt-4 font-mono text-2xl font-bold text-cyan-400">
            {countdown > 0 ? `${countdown}s` : 'Refreshing...'}
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-xl glass p-4">
            <img src={display?.avatarUrl} alt="" className="size-14 rounded-full border-2 border-cyan-400/50" />
            <div className="text-left">
              <p className="font-bold">{display?.fullName}</p>
              <p className="text-sm text-cyan-300">{display?.studentId}</p>
              <p className="text-xs text-slate-400">{display?.department}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="rounded-lg bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
            >
              Refresh QR
            </button>
            <button
              type="button"
              onClick={() => setFullscreen(!fullscreen)}
              className="rounded-lg border border-white/20 px-5 py-2 text-sm hover:bg-white/5"
            >
              {fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

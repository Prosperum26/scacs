import { useCallback, useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import type { QrData } from '../../types/api'

function qrDisplaySize(fullscreen: boolean, windowWidth: number): number {
  const safe = Math.min(windowWidth, typeof window !== 'undefined' ? window.screen?.width ?? windowWidth : windowWidth)
  if (fullscreen) {
    return Math.min(Math.max(safe - 24, 200), 340)
  }
  // Fit QR in viewport minus padding + bottom tab bar (~5.5rem) + header text
  const reserved = 140
  return Math.min(Math.max(safe - reserved, 200), 280)
}

export default function MyQr() {
  const { token, user } = useAuth()
  const windowWidth = useWindowWidth()
  const [qr, setQr] = useState<QrData | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(false)

  const qrSize = qrDisplaySize(fullscreen, windowWidth)

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
    <div
      className={`animate-slide-up ${fullscreen ? 'fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950 px-3 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]' : ''}`}
    >
      <div className="mx-auto w-full max-w-lg px-0 text-center sm:px-2">
        <h1 className="text-xl font-bold sm:text-2xl">My QR Code</h1>
        <p className="mt-1 text-xs text-slate-400 sm:text-sm">
          Show this screen to the gate camera · auto-refresh every 45s
        </p>

        <div className="mt-6 flex flex-col items-center sm:mt-8">
          <div className={`qr-ring max-w-[min(100%,22rem)] animate-pulse-glow ${loading ? 'opacity-50' : ''}`}>
            <div className="rounded-xl bg-slate-950 p-2 sm:p-4">
              {qr?.qrToken ? (
                <QRCodeSVG value={qr.qrToken} size={qrSize} level="H" includeMargin />
              ) : (
                <div
                  className="grid place-items-center text-slate-500"
                  style={{ width: qrSize, height: qrSize }}
                >
                  Loading…
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 font-mono text-xl font-bold text-cyan-400 sm:mt-4 sm:text-2xl">
            {countdown > 0 ? `${countdown}s` : 'Refreshing…'}
          </p>

          <div className="mt-4 flex w-full max-w-sm items-center gap-3 rounded-xl glass p-3 sm:mt-6 sm:gap-4 sm:p-4">
            <img
              src={display?.avatarUrl}
              alt=""
              className="size-12 shrink-0 rounded-full border-2 border-cyan-400/50 sm:size-14"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-bold">{display?.fullName}</p>
              <p className="truncate text-sm text-cyan-300">{display?.studentId}</p>
              <p className="truncate text-xs text-slate-400">{display?.department}</p>
            </div>
          </div>

          <div className="mt-5 flex w-full max-w-sm flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="tap-target w-full rounded-lg bg-cyan-500 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50 sm:w-auto sm:min-w-[8rem] sm:py-2.5"
            >
              Refresh QR
            </button>
            <button
              type="button"
              onClick={() => setFullscreen(!fullscreen)}
              className="tap-target w-full rounded-lg border border-white/20 py-3 text-sm hover:bg-white/5 sm:w-auto sm:min-w-[8rem] sm:py-2.5"
            >
              {fullscreen ? 'Exit fullscreen' : 'Fullscreen for scan'}
            </button>
          </div>

          <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-slate-500 sm:text-xs">
            Tip: increase brightness and use fullscreen so the scanner reads the code easily.
          </p>
        </div>
      </div>
    </div>
  )
}

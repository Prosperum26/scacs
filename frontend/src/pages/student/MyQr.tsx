import { useCallback, useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import { useWindowWidth } from '../../hooks/useWindowWidth'
import type { QrData } from '../../types/api'

/** Large modules + low EC = easier for laptop webcams scanning phone screens. */
function qrDisplaySize(fullscreen: boolean, windowWidth: number): number {
  const safe = Math.min(windowWidth, typeof window !== 'undefined' ? window.screen?.width ?? windowWidth : windowWidth)
  if (fullscreen) {
    return Math.min(Math.max(safe - 32, 260), 400)
  }
  const reserved = 120
  return Math.min(Math.max(safe - reserved, 260), 320)
}

export default function MyQr() {
  const { token, user } = useAuth()
  const windowWidth = useWindowWidth()
  const [qr, setQr] = useState<QrData | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [maxBrightness, setMaxBrightness] = useState(false)

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

  useEffect(() => {
    if (!maxBrightness) return
    const prev = document.body.style.filter
    document.body.style.filter = 'brightness(1.15)'
    return () => {
      document.body.style.filter = prev
    }
  }, [maxBrightness])

  const display = qr?.user ?? user

  return (
    <div
      className={`animate-slide-up ${fullscreen ? 'fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white px-3 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] text-slate-900' : ''}`}
    >
      <div className={`mx-auto w-full max-w-lg px-0 text-center sm:px-2 ${fullscreen ? 'text-slate-900' : ''}`}>
        <h1 className={`text-xl font-bold sm:text-2xl ${fullscreen ? 'text-slate-900' : ''}`}>My QR Code</h1>
        <p className={`mt-1 text-xs sm:text-sm ${fullscreen ? 'text-slate-600' : 'text-slate-400'}`}>
          Hold steady ~30cm from the gate camera · simple code for fast scan
        </p>

        <div className="mt-6 flex flex-col items-center sm:mt-8">
          <div
            className={`rounded-2xl p-3 shadow-lg sm:p-4 ${loading ? 'opacity-50' : ''} ${
              fullscreen ? 'bg-white ring-4 ring-cyan-400/30' : 'qr-ring animate-pulse-glow max-w-[min(100%,24rem)]'
            }`}
          >
            <div className="rounded-xl bg-white p-3 sm:p-4">
              {qr?.qrToken ? (
                <QRCodeSVG
                  value={qr.qrToken}
                  size={qrSize}
                  level="L"
                  marginSize={2}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              ) : (
                <div
                  className="grid place-items-center bg-white text-slate-500"
                  style={{ width: qrSize, height: qrSize }}
                >
                  Loading…
                </div>
              )}
            </div>
          </div>

          <p className={`mt-3 font-mono text-xl font-bold sm:mt-4 sm:text-2xl ${fullscreen ? 'text-cyan-700' : 'text-cyan-400'}`}>
            {countdown > 0 ? `${countdown}s` : 'Refreshing…'}
          </p>
          {qr?.qrToken && (
            <p className={`mt-2 font-mono text-[10px] tracking-wide sm:text-xs ${fullscreen ? 'text-slate-500' : 'text-slate-500'}`}>
              Backup code: <span className="select-all font-bold text-slate-300">{qr.qrToken}</span>
            </p>
          )}

          {!fullscreen && (
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
          )}

          <div className="mt-5 flex w-full max-w-sm flex-col gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className={`tap-target w-full rounded-lg py-3 text-sm font-semibold disabled:opacity-50 sm:w-auto sm:min-w-[8rem] sm:py-2.5 ${
                fullscreen ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
              }`}
            >
              Refresh QR
            </button>
            <button
              type="button"
              onClick={() => setFullscreen(!fullscreen)}
              className={`tap-target w-full rounded-lg border py-3 text-sm sm:w-auto sm:min-w-[8rem] sm:py-2.5 ${
                fullscreen
                  ? 'border-slate-300 bg-slate-100 text-slate-800'
                  : 'border-white/20 hover:bg-white/5'
              }`}
            >
              {fullscreen ? 'Exit scan mode' : 'Scan mode (fullscreen)'}
            </button>
            <button
              type="button"
              onClick={() => setMaxBrightness((b) => !b)}
              className={`tap-target w-full rounded-lg border py-3 text-sm sm:w-auto sm:py-2.5 ${
                fullscreen ? 'border-slate-300' : 'border-white/20'
              } ${maxBrightness ? 'bg-amber-500/20 text-amber-300' : ''}`}
            >
              {maxBrightness ? 'Brightness boost on' : 'Boost brightness'}
            </button>
          </div>

          <p className={`mt-4 max-w-sm text-[11px] leading-relaxed sm:text-xs ${fullscreen ? 'text-slate-600' : 'text-slate-500'}`}>
            For gate staff: use fullscreen, max screen brightness, and fill the camera view. Keep the phone still for 1–2 seconds.
          </p>
        </div>
      </div>
    </div>
  )
}

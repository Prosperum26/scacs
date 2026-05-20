import { useEffect, useId, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

type Props = {
  active: boolean
  qrBox: number
  onScan: (code: string) => void
  onError: (message: string) => void
}

/**
 * Isolated camera mount — html5-qrcode owns the inner DOM.
 * Parent re-renders (scan result, logs) must NOT restart this effect.
 */
export default function QrCameraScanner({ active, qrBox, onScan, onError }: Props) {
  const reactId = useId().replace(/:/g, '')
  const elementId = `scacs-qr-${reactId}`
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const onScanRef = useRef(onScan)
  const onErrorRef = useRef(onError)
  const processingRef = useRef(false)
  const qrBoxRef = useRef(qrBox)
  const activeRef = useRef(active)

  onScanRef.current = onScan
  onErrorRef.current = onError
  qrBoxRef.current = qrBox
  activeRef.current = active

  useEffect(() => {
    if (!active) {
      const instance = scannerRef.current
      scannerRef.current = null
      if (instance) {
        instance.stop().catch(() => {})
      }
      return
    }

    const scanner = new Html5Qrcode(elementId, { verbose: false })
    scannerRef.current = scanner

    const start = async () => {
      try {
        const cameras = await Html5Qrcode.getCameras()
        const laptopCam =
          cameras.find((c) => /facetime|integrated|built.?in|webcam|user/i.test(c.label)) ??
          cameras[0]
        const cameraIdOrConfig = laptopCam?.id ?? { facingMode: 'user' as const }

        await scanner.start(
          cameraIdOrConfig,
          {
            fps: 15,
            aspectRatio: 1,
            disableFlip: false,
            videoConstraints: {
              facingMode: 'user',
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
            },
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const box = qrBoxRef.current
              const size = Math.min(box, viewfinderWidth * 0.92, viewfinderHeight * 0.85)
              return { width: size, height: size }
            },
          },
          (decoded) => {
            if (processingRef.current) return
            processingRef.current = true
            try {
              scannerRef.current?.pause(true)
            } catch {
              /* ignore */
            }
            void Promise.resolve(onScanRef.current(decoded)).finally(() => {
              window.setTimeout(() => {
                processingRef.current = false
                try {
                  if (scannerRef.current && activeRef.current) {
                    scannerRef.current.resume()
                  }
                } catch {
                  /* scanner stopped */
                }
              }, 2500)
            })
          },
          () => {},
        )
      } catch (err) {
        console.error(err)
        onErrorRef.current('Could not start camera. Allow permission or try manual code below.')
      }
    }

    start()

    return () => {
      processingRef.current = false
      scanner.stop().catch(() => {})
      scannerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only start/stop with active; callbacks via refs
  }, [active, elementId])

  if (!active) return null

  return (
    <div
      id={elementId}
      className="scacs-qr-reader-host min-h-[360px] w-full bg-black sm:min-h-[420px]"
    />
  )
}

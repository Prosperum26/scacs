import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'
import type { ScanResult } from '../types/api'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface SocketState {
  socket: Socket | null
  lastScan: ScanResult | null
  scanVersion: number
}

const SocketContext = createContext<SocketState>({ socket: null, lastScan: null, scanVersion: 0 })

export function SocketProvider({ children }: { children: ReactNode }) {
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)
  const [scanVersion, setScanVersion] = useState(0)

  const socket = useMemo(() => io(SOCKET_URL, { transports: ['websocket', 'polling'] }), [])

  useEffect(() => {
    socket.on('scan:result', (data: ScanResult) => {
      setLastScan(data)
      setScanVersion((v) => v + 1)
    })
    return () => {
      socket.off('scan:result')
      socket.disconnect()
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{ socket, lastScan, scanVersion }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}

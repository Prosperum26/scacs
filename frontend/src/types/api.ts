export interface User {
  id: string
  email: string
  fullName: string
  studentId: string
  department: string
  role: 'student' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  avatarUrl: string
  accessLevel: string
}

export interface QrData {
  qrToken: string
  expiresAt: string
  expiresInSec: number
  sessionId: string
  user: User
}

export interface StudentDashboard {
  totalCheckIns: number
  lastAccessTime: string | null
  activeQrStatus: string
  campusAccessLevel: string
  user: User
}

export interface ScanResult {
  id: string
  status: 'GRANTED' | 'DENIED'
  reason?: string
  studentId: string
  studentName: string
  gate: string
  timestamp: string
  user: {
    id: string
    fullName: string
    studentId: string
    department: string
    avatarUrl: string
  } | null
}

export interface AccessHistoryItem {
  id: string
  time: string
  gate: string
  status: string
  method: string
  reason?: string
}

export interface Alert {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high'
  title: string
  message: string
  studentId?: string
  gate?: string
  resolved: boolean
  createdAt: string
}

export interface Analytics {
  dailyCheckIns: number
  deniedToday: number
  activeStudents: number
  hourlyStats: { hour: string; granted: number; denied: number; total: number }[]
  gateTraffic: { gate: string; count: number }[]
  dailyTrend: { date: string; count: number }[]
}

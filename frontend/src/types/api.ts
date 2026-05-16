export type UserStatus = 'active' | 'inactive' | 'suspended'
export type UserRole = 'student' | 'faculty' | 'staff'
export type AccessResult = 'GRANTED' | 'DENIED'

export type ApiResponse<T> = {
  success: boolean
  data: T
  message?: string
}

export type User = {
  id: string
  name: string
  role: UserRole
  department: string
  status: UserStatus
}

export type AccessLog = {
  id: string
  userId: string
  userName: string
  gate: string
  result: AccessResult
  timestamp: string
}

export type DashboardStats = {
  stats: Array<{
    label: string
    value: string
    change: string
    tone: string
  }>
  hourlyTraffic: number[]
  gateHealth: Array<{
    gate: string
    value: number
  }>
}

export type VerifyAccessResponse = {
  result: AccessResult
  user: User | null
  log: AccessLog
}

export type CreateUserPayload = {
  id: string
  name: string
  role: UserRole
  department: string
  status: UserStatus
}

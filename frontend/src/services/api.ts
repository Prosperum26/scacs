import type { Alert, Analytics, QrData, ScanResult, StudentDashboard, User, AccessHistoryItem } from '../types/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type ApiResponse<T> = { success: boolean; data: T; message?: string }

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const body = (await res.json()) as ApiResponse<T> & { message?: string }
  if (!res.ok) throw new Error(body.message ?? 'Request failed')
  return body.data
}

export const api = {
  register: (payload: Record<string, string>) =>
    request<{ user: User; token: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  studentLogin: (email: string, password: string) =>
    request<{ user: User; token: string }>('/api/auth/login/student', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  adminLogin: (email: string, password: string) =>
    request<{ user: User; token: string }>('/api/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: (token: string) => request<{ user: User }>('/api/auth/me', {}, token),
  getQr: (token: string) => request<QrData>('/api/qr/token', {}, token),
  studentDashboard: (token: string) => request<StudentDashboard>('/api/qr/dashboard', {}, token),
  history: (token: string, params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    return request<AccessHistoryItem[]>(`/api/access/history${q}`, {}, token)
  },
  verifyQr: (token: string, qrToken: string, gate: string) =>
    request<ScanResult>('/api/access/verify', {
      method: 'POST',
      body: JSON.stringify({ qrToken, gate }),
    }, token),
  logs: (token: string) => request<ScanResult[]>('/api/access/logs', {}, token),
  students: (token: string, q?: string) => {
    const query = q ? `?q=${encodeURIComponent(q)}` : ''
    return request<Array<{ id: string; studentId: string; name: string; department: string; status: string; email: string }>>(
      `/api/admin/students${query}`,
      {},
      token,
    )
  },
  updateStudentStatus: (token: string, id: string, status: string) =>
    request<User>(`/api/admin/students/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token),
  resetQr: (token: string, id: string) =>
    request<{ message: string }>(`/api/admin/students/${id}/reset-qr`, { method: 'POST' }, token),
  analytics: (token: string) => request<Analytics>('/api/admin/analytics', {}, token),
  alerts: (token: string) => request<Alert[]>('/api/admin/alerts', {}, token),
  gates: (token: string) => request<Array<{ name: string; zone: string; status: string }>>('/api/admin/gates', {}, token),
}

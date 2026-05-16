import type { ApiResponse, CreateUserPayload, DashboardStats, AccessLog, User, VerifyAccessResponse } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const contentType = response.headers.get('content-type')
  const payload = contentType?.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'message' in payload ? String(payload.message) : 'API request failed'
    throw new Error(message)
  }

  return payload as T
}

async function getData<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await request<ApiResponse<T>>(path, options)
  return response.data
}

export const apiClient = {
  getDashboardStats: () => getData<DashboardStats>('/dashboard/stats'),
  getUsers: () => getData<User[]>('/users'),
  createUser: (payload: CreateUserPayload) =>
    getData<User>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  deleteUser: (id: string) =>
    request<ApiResponse<never>>(`/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  verifyAccess: (studentId: string, gate = 'Main Gate A') =>
    getData<VerifyAccessResponse>('/access/verify', {
      method: 'POST',
      body: JSON.stringify({ studentId, gate }),
    }),
  getLogs: () => getData<AccessLog[]>('/logs'),
}

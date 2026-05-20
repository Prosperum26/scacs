import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../services/api'
import type { User } from '../types/api'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const storageKey = (role: string) => `scacs_${role}_auth`

export function AuthProvider({ role, children }: { role: 'student' | 'admin'; children: ReactNode }) {
  const key = storageKey(role)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(key)
    if (!raw) {
      setLoading(false)
      return
    }
    try {
      const parsed = JSON.parse(raw) as { token: string; user: User }
      if (parsed.user.role !== role) {
        localStorage.removeItem(key)
        setLoading(false)
        return
      }
      api.me(parsed.token)
        .then(({ user: u }) => {
          setToken(parsed.token)
          setUser(u)
        })
        .catch(() => localStorage.removeItem(key))
        .finally(() => setLoading(false))
    } catch {
      setLoading(false)
    }
  }, [key, role])

  const login = useCallback(
    (t: string, u: User) => {
      setToken(t)
      setUser(u)
      localStorage.setItem(key, JSON.stringify({ token: t, user: u }))
    },
    [key],
  )

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(key)
  }, [key])

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

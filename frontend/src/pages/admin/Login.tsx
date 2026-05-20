import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@scacs.edu')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token, user } = await api.adminLogin(email, password)
      login(token, user)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-bg flex min-h-[100dvh] items-center justify-center overflow-y-auto p-4 py-8">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded border border-emerald-500/20 bg-slate-950/90 p-6 shadow-2xl shadow-emerald-500/5 sm:p-8"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500">Security Portal</p>
        <h1 className="mt-2 text-lg font-bold text-white sm:text-xl">Admin / Security Login</h1>
        <div className="mt-6 space-y-4">
          <input
            type="email"
            inputMode="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@scacs.edu"
            className="tap-target w-full rounded border border-slate-800 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:border-emerald-500"
          />
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="tap-target w-full rounded border border-slate-800 bg-slate-900 px-4 py-3 text-base text-white outline-none focus:border-emerald-500"
          />
        </div>
        {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="tap-target mt-6 w-full rounded bg-emerald-600 py-3.5 text-base font-bold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Enter control center'}
        </button>
        <p className="mt-4 text-center text-xs text-slate-600">
          <Link to="/" className="hover:text-emerald-400">← Portal home</Link>
        </p>
      </form>
    </div>
  )
}

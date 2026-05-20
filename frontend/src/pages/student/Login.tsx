import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

export default function StudentLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token, user } = await api.studentLogin(email, password)
      login(token, user)
      navigate('/student')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="student-bg flex min-h-[100dvh] items-center justify-center overflow-y-auto p-4 py-8">
      <form
        onSubmit={submit}
        className="glass animate-slide-up w-full max-w-md rounded-2xl p-6 shadow-2xl sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">SCACS</p>
        <h1 className="mt-2 text-xl font-bold text-white sm:text-2xl">Student Login</h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs text-slate-300">Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sv2026001@student.scacs.edu"
              className="tap-target mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none focus:border-cyan-400"
            />
          </label>
          <label className="block">
            <span className="text-xs text-slate-300">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="tap-target mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none focus:border-cyan-400"
            />
          </label>
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-slate-400">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-5" />
            Remember me
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="tap-target mt-6 w-full rounded-lg bg-cyan-500 py-3.5 text-base font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          <Link to="/student/register" className="text-cyan-400 hover:underline">
            Create account
          </Link>
          {' · '}
          <span className="cursor-pointer hover:text-white">Forgot password</span>
        </p>
        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/" className="hover:text-cyan-400">← Back to portal</Link>
        </p>
      </form>
    </div>
  )
}

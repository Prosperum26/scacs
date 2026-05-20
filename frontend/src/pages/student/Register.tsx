import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const fields = [
  { key: 'fullName', label: 'Full Name', type: 'text' },
  { key: 'studentId', label: 'Student ID', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'department', label: 'Department / Faculty', type: 'text' },
  { key: 'password', label: 'Password', type: 'password' },
  { key: 'confirmPassword', label: 'Confirm Password', type: 'password' },
] as const

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { token, user } = await api.register({
        fullName: form.fullName,
        studentId: form.studentId,
        email: form.email,
        password: form.password,
        department: form.department,
      })
      login(token, user)
      navigate('/student')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="student-bg flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="glass animate-slide-up w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">SCACS</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Student Registration</h1>
        <p className="mt-1 text-sm text-slate-400">Create your smart campus ID account</p>
        <div className="mt-6 space-y-4">
          {fields.map(({ key, label, type }) => (
            <label key={key} className="block">
              <span className="text-xs font-medium text-slate-300">{label}</span>
              <input
                type={type}
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-cyan-400"
              />
            </label>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/student/login" className="text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}

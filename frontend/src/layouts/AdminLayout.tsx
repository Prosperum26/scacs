import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Live Scanner', end: true },
  { to: '/admin/logs', label: 'Access Logs' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/alerts', label: 'Alerts' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="admin-bg min-h-screen text-slate-200">
      <div className="flex min-h-screen">
        <aside className="w-56 shrink-0 border-r border-emerald-500/10 bg-slate-950/80 p-4">
          <div className="mb-8 border-b border-emerald-500/20 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">SCACS SOC</p>
            <h1 className="text-sm font-bold text-white">Security Control</h1>
          </div>
          <nav className="space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `block rounded px-3 py-2 text-sm ${
                    isActive
                      ? 'bg-emerald-500/15 font-semibold text-emerald-300'
                      : 'text-slate-500 hover:bg-slate-900 hover:text-slate-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
            className="mt-8 w-full rounded border border-slate-800 py-2 text-xs text-slate-500 hover:text-rose-400"
          >
            Sign out
          </button>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

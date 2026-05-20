import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/admin', short: 'Scanner', full: 'Live Scanner', end: true },
  { to: '/admin/logs', short: 'Logs', full: 'Access Logs' },
  { to: '/admin/students', short: 'Students', full: 'Students' },
  { to: '/admin/analytics', short: 'Charts', full: 'Analytics' },
  { to: '/admin/alerts', short: 'Alerts', full: 'Alerts' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = (isActive: boolean) =>
    `tap-target shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium sm:text-sm ${
      isActive ? 'bg-emerald-500/20 font-semibold text-emerald-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`

  return (
    <div className="admin-bg min-h-[100dvh] text-slate-200">
      <div className="flex min-h-[100dvh] flex-col lg:flex-row">
        {/* Mobile: horizontal nav */}
        <header className="sticky top-0 z-30 border-b border-emerald-500/10 bg-slate-950/95 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)] lg:hidden">
          <div className="flex items-center justify-between gap-2 px-2 py-2">
            <p className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-emerald-500">SCACS</p>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/admin/login')
              }}
              className="tap-target shrink-0 rounded border border-slate-700 px-2 py-1.5 text-[10px] text-slate-400 hover:text-rose-400"
            >
              Sign out
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => linkClass(isActive)}>
                {item.short}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-emerald-500/10 bg-slate-950/80 p-4 lg:flex">
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
                {item.full}
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

        <main className="flex-1 overflow-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

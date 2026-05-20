import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/student', label: 'Dashboard', end: true },
  { to: '/student/qr', label: 'My QR Code' },
  { to: '/student/history', label: 'Access History' },
  { to: '/student/profile', label: 'Profile' },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="student-bg min-h-screen text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950/50 p-6 lg:flex">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">SCACS</p>
            <h1 className="text-lg font-bold">Campus ID</h1>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
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
              navigate('/student/login')
            }}
            className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-400 hover:border-rose-500/50 hover:text-rose-300"
          >
            Sign out
          </button>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <header className="mb-6 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-xs text-cyan-400">Welcome</p>
              <p className="font-semibold">{user?.fullName}</p>
            </div>
            <button type="button" onClick={logout} className="text-sm text-slate-400">
              Logout
            </button>
          </header>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

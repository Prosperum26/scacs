import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type StudentNavItem = {
  to: string
  label: string
  short: string
  end?: boolean
}

const nav: StudentNavItem[] = [
  { to: '/student', label: 'Dashboard', short: 'Home', end: true },
  { to: '/student/qr', label: 'My QR Code', short: 'QR' },
  { to: '/student/history', label: 'Access History', short: 'History' },
  { to: '/student/profile', label: 'Profile', short: 'Profile' },
]

function navClass(isActive: boolean, compact?: boolean) {
  if (compact) {
    const base =
      'flex items-center justify-center rounded-lg font-semibold transition tap-target min-h-[3rem] flex-1 px-1 py-2 text-xs sm:text-sm '
    if (isActive) return `${base} bg-cyan-500/20 text-cyan-300`
    return `${base} text-slate-400 hover:bg-white/5 hover:text-white`
  }
  const base = 'block rounded-lg px-4 py-2.5 text-sm font-medium transition '
  if (isActive) return `${base} bg-cyan-500/20 text-cyan-300`
  return `${base} text-slate-400 hover:bg-white/5 hover:text-white`
}

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="student-bg min-h-[100dvh] text-slate-100">
      <div className="flex min-h-[100dvh] flex-col lg:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950/50 p-6 lg:flex">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">SCACS</p>
            <h1 className="text-lg font-bold">Campus ID</h1>
          </div>
          <nav className="flex flex-1 flex-col gap-1">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navClass(isActive)}>
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

        {/* Main: extra bottom padding on mobile for tab bar + safe area */}
        <main className="flex flex-1 flex-col overflow-auto px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-4 md:px-6 md:py-8 lg:pb-8">
          <header className="mb-4 flex min-h-[2.75rem] items-center justify-between gap-3 lg:mb-6 lg:hidden">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-cyan-400">Campus ID</p>
              <p className="truncate font-semibold">{user?.fullName}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/student/login')
              }}
              className="tap-target shrink-0 rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300 hover:border-rose-500/40 hover:text-rose-300"
            >
              Sign out
            </button>
          </header>
          <div className="flex-1">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom navigation — digital ID app pattern */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/10 bg-slate-950/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_32px_rgba(0,0,0,0.35)] lg:hidden"
          aria-label="Student navigation"
        >
          <div className="mx-auto flex h-[3.25rem] w-full max-w-lg items-stretch justify-between gap-1 px-1 pt-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => navClass(isActive, true)}
              >
                <span className="font-semibold tracking-tight">{item.short}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

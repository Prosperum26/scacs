import { navItems } from '../data/mockData'
import type { Page } from '../types/navigation'

type NavbarProps = {
  activePage: Page
  onNavigate: (path: string) => void
}

function Navbar({ activePage, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex min-h-20 flex-col justify-center gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Smart Campus Access Control System
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">
            {activePage === 'Logs' ? 'Access Logs' : activePage}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
            <span className="size-2 rounded-full bg-emerald-500"></span>
            System Online
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
            <span className="text-slate-500">Operator</span>
            <span className="ml-2 font-semibold text-slate-900">Admin Nguyen</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-3 sm:px-6 lg:hidden">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.path)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              activePage === item.label ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {item.label === 'Logs' ? 'Access Logs' : item.label}
          </button>
        ))}
      </div>
    </header>
  )
}

export default Navbar

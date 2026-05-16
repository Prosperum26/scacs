import { navItems } from '../data/mockData'
import type { Page } from '../types/navigation'

type SidebarProps = {
  activePage: Page
  onNavigate: (path: string) => void
}

function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-cyan-400 font-bold text-slate-950">
            SC
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">SCACS</p>
            <p className="text-xs text-slate-400">Smart Campus Access</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-5">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.path)}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
              activePage === item.label
                ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/20'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{item.label === 'Logs' ? 'Access Logs' : item.label}</span>
            <span className="text-xs opacity-70">0{index + 1}</span>
          </button>
        ))}
      </nav>
      <div className="m-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Mode</p>
        <p className="mt-2 text-sm text-slate-200">Campus perimeter monitoring is active.</p>
      </div>
    </aside>
  )
}

export default Sidebar

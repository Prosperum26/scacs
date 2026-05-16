import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import type { Page } from '../types/navigation'
import Outlet from './Outlet'

type MainLayoutProps = {
  activePage: Page
  children: ReactNode
  onNavigate: (path: string) => void
}

function MainLayout({ activePage, children, onNavigate }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#eef2f7] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <main className="min-w-0 flex-1">
          <Navbar activePage={activePage} onNavigate={onNavigate} />
          <Outlet>{children}</Outlet>
        </main>
      </div>
    </div>
  )
}

export default MainLayout

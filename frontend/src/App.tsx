import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { navItems } from './data/mockData'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Logs from './pages/Logs'
import Reports from './pages/Reports'
import Scanner from './pages/Scanner'
import Users from './pages/Users'
import type { Page } from './types/navigation'

const routes: Record<string, { page: Page; element: ReactNode }> = {
  '/': { page: 'Dashboard', element: <Dashboard /> },
  '/scanner': { page: 'Scanner', element: <Scanner /> },
  '/users': { page: 'Users', element: <Users /> },
  '/logs': { page: 'Logs', element: <Logs /> },
  '/reports': { page: 'Reports', element: <Reports /> },
}

function App() {
  const [currentPath, setCurrentPath] = useState('/')

  const currentRoute = useMemo(() => routes[currentPath] ?? routes['/'], [currentPath])

  const navigate = (path: string) => {
    setCurrentPath(navItems.some((item) => item.path === path) ? path : '/')
  }

  return (
    <MainLayout activePage={currentRoute.page} onNavigate={navigate}>
      {currentRoute.element}
    </MainLayout>
  )
}

export default App

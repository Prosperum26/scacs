import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import ToastContainer from './components/ToastContainer'
import { DemoProvider } from './context/DemoProvider'
import { useDemo } from './context/demoContext'
import { navItems } from './data/mockData'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
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
  return (
    <DemoProvider>
      <AppShell />
      <ToastContainer />
    </DemoProvider>
  )
}

function AppShell() {
  const [currentPath, setCurrentPath] = useState('/')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { pushToast } = useDemo()

  const currentRoute = useMemo(() => routes[currentPath] ?? routes['/'], [currentPath])

  const navigate = (path: string) => {
    setCurrentPath(navItems.some((item) => item.path === path) ? path : '/')
  }

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={() => {
          setIsAuthenticated(true)
          pushToast({
            title: 'Demo session started',
            message: 'Operator logged in. Dashboard is ready for the presentation flow.',
            tone: 'success',
          })
        }}
      />
    )
  }

  return (
    <MainLayout activePage={currentRoute.page} onNavigate={navigate}>
      {currentRoute.element}
    </MainLayout>
  )
}

export default App

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import StudentLayout from './layouts/StudentLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import StudentLogin from './pages/student/Login'
import Register from './pages/student/Register'
import StudentDashboard from './pages/student/Dashboard'
import MyQr from './pages/student/MyQr'
import History from './pages/student/History'
import Profile from './pages/student/Profile'
import AdminLogin from './pages/admin/Login'
import Scanner from './pages/admin/Scanner'
import AdminLogs from './pages/admin/Logs'
import Students from './pages/admin/Students'
import Analytics from './pages/admin/Analytics'
import Alerts from './pages/admin/Alerts'

function Protected({ children, loginTo }: { children: React.ReactNode; loginTo: string }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-400">Loading...</div>
  if (!user) return <Navigate to={loginTo} replace />
  return <>{children}</>
}

function StudentRoutes() {
  return (
    <AuthProvider role="student">
      <Routes>
        <Route path="login" element={<StudentLogin />} />
        <Route path="register" element={<Register />} />
        <Route
          path="/"
          element={
            <Protected loginTo="/student/login">
              <StudentLayout />
            </Protected>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="qr" element={<MyQr />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </AuthProvider>
  )
}

function AdminRoutes() {
  return (
    <AuthProvider role="admin">
      <SocketProvider>
        <Routes>
          <Route path="login" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <Protected loginTo="/admin/login">
                <AdminLayout />
              </Protected>
            }
          >
            <Route index element={<Scanner />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="students" element={<Students />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

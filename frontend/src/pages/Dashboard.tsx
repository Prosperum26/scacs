import { useEffect, useState } from 'react'
import { AreaChart } from '../components/Charts'
import Card from '../components/Card'
import DemoActivityFeed from '../components/DemoActivityFeed'
import Skeleton from '../components/Skeleton'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { useDemo } from '../context/demoContext'
import { apiClient } from '../services/apiClient'
import type { AccessLog, DashboardStats } from '../types/api'

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null)
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pulse, setPulse] = useState(0)
  const { pushToast } = useDemo()

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async (silent = false) => {
      try {
        if (!silent) {
          setIsLoading(true)
        }
        setError('')
        const [dashboardData, logData] = await Promise.all([apiClient.getDashboardStats(), apiClient.getLogs()])

        if (isMounted) {
          setDashboard(dashboardData)
          setLogs(logData)
          setPulse((current) => current + 1)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()
    const intervalId = window.setInterval(() => loadDashboard(true), 4000)

    return () => {
      isMounted = false
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (pulse > 1) {
      pushToast({
        title: 'Dashboard refreshed',
        message: 'Live access metrics updated from backend.',
        tone: 'info',
      })
    }
  }, [pulse, pushToast])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-32" />
          ))}
        </section>
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return <Card title="Dashboard" subtitle="Unable to load live campus access data">{error || 'Dashboard data unavailable'}</Card>
  }

  const chartData = dashboard.hourlyTraffic.map((value, index) => ({
    label: `${index + 7}:00`,
    value,
  }))

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Entry Volume" subtitle="Auto-refreshing campus access trend">
          <AreaChart data={chartData} />
        </Card>
        <Card title="Live Activity Feed" subtitle="Demo mode campus activity">
          <DemoActivityFeed />
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card title="Gate Health" subtitle="Operational status by checkpoint">
          <div className="space-y-5 pt-2">
            {dashboard.gateHealth.map((gate) => (
              <div key={gate.gate}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{gate.gate}</span>
                  <span className="text-slate-500">{gate.value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-900 transition-all duration-700" style={{ width: `${gate.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Recent Access Events" subtitle="Latest campus gate activity">
          <Table
            headers={['Time', 'User', 'Gate', 'Method', 'Result']}
            rows={logs.slice(0, 5).map((log) => [
              new Date(log.timestamp).toLocaleTimeString(),
              log.userName,
              log.gate,
              'QR',
              <StatusBadge value={log.result} />,
            ])}
          />
        </Card>
      </section>
    </div>
  )
}

export default Dashboard

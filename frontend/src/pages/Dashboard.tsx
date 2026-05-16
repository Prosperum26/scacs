import { useEffect, useState } from 'react'
import Card from '../components/Card'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { apiClient } from '../services/apiClient'
import type { AccessLog, DashboardStats } from '../types/api'

function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null)
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true)
        setError('')
        const [dashboardData, logData] = await Promise.all([apiClient.getDashboardStats(), apiClient.getLogs()])
        setDashboard(dashboardData)
        setLogs(logData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return <Card title="Dashboard" subtitle="Loading live campus access data">Loading dashboard...</Card>
  }

  if (error || !dashboard) {
    return <Card title="Dashboard" subtitle="Unable to load live campus access data">{error || 'Dashboard data unavailable'}</Card>
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Entry Volume" subtitle="Hourly campus access activity">
          <div className="flex h-72 items-end gap-3 pt-6">
            {dashboard.hourlyTraffic.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div
                  className="w-full rounded-t bg-cyan-500/85 transition hover:bg-cyan-400"
                  style={{ height: `${value * 1.7}px` }}
                ></div>
                <span className="text-xs text-slate-500">{`${index + 7}:00`}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Gate Health" subtitle="Live mock operational status">
          <div className="space-y-5 pt-4">
            {dashboard.gateHealth.map((gate) => (
              <div key={gate.gate}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{gate.gate}</span>
                  <span className="text-slate-500">{gate.value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-900" style={{ width: `${gate.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
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
    </div>
  )
}

export default Dashboard

import { useEffect, useMemo, useState } from 'react'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { apiClient } from '../services/apiClient'
import type { AccessLog } from '../types/api'

function Logs() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setIsLoading(true)
        setError('')
        setLogs(await apiClient.getLogs())
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load access logs')
      } finally {
        setIsLoading(false)
      }
    }

    loadLogs()
  }, [])

  const filteredLogs = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return logs
    }

    return logs.filter(
      (log) => log.userName.toLowerCase().includes(keyword) || log.userId.toLowerCase().includes(keyword),
    )
  }, [logs, search])

  return (
    <Card title="Access Logs" subtitle="Audit trail for campus entrances">
      <div className="mb-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full max-w-md rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          placeholder="Search by name or ID"
        />
      </div>
      {error && <p className="mb-4 text-sm font-medium text-rose-700">{error}</p>}
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading access logs...</p>
      ) : (
        <Table
          headers={['Time', 'User', 'Gate', 'Method', 'Result']}
          rows={filteredLogs.map((log) => [
            new Date(log.timestamp).toLocaleTimeString(),
            `${log.userName} (${log.userId})`,
            log.gate,
            'QR',
            <StatusBadge value={log.result} />,
          ])}
        />
      )}
    </Card>
  )
}

export default Logs

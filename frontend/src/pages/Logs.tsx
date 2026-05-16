import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { logs } from '../data/mockData'

function Logs() {
  return (
    <Card title="Access Logs" subtitle="Mock audit trail for campus entrances">
      <Table
        headers={['Time', 'User', 'Gate', 'Method', 'Result']}
        rows={logs.map((log) => [log.time, log.user, log.gate, log.method, <StatusBadge value={log.result} />])}
      />
    </Card>
  )
}

export default Logs

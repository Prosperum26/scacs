import Card from '../components/Card'
import { DonutChart } from '../components/Charts'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { reportRows } from '../data/mockData'

const accessMix = [
  { label: 'Students', value: 72, color: '#06b6d4' },
  { label: 'Faculty', value: 18, color: '#0f172a' },
  { label: 'Staff', value: 10, color: '#f59e0b' },
]

function Reports() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <Card title="Report Queue" subtitle="Presentation-ready security reports">
        <Table
          headers={['Report', 'Owner', 'Updated', 'Status']}
          rows={reportRows.map((report) => [report.name, report.owner, report.updated, <StatusBadge value={report.status} />])}
        />
      </Card>
      <div className="space-y-6">
        <Card title="Access Mix" subtitle="Credential usage by campus group">
          <DonutChart data={accessMix} />
        </Card>
        <Card title="Demo Flow Checklist" subtitle="Recommended presentation sequence">
          <div className="grid gap-3">
            {['Login completed', 'Dashboard metrics refreshed', 'Scanner verification ready', 'Logs searchable', 'Reports prepared'].map(
              (item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                  <span className="size-2 rounded-full bg-emerald-500"></span>
                  {item}
                </div>
              ),
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Reports

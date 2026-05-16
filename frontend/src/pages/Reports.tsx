import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Table from '../components/Table'
import { reportRows } from '../data/mockData'

function Reports() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <Card title="Report Queue" subtitle="Static reports for the UI skeleton">
        <Table
          headers={['Report', 'Owner', 'Updated', 'Status']}
          rows={reportRows.map((report) => [report.name, report.owner, report.updated, <StatusBadge value={report.status} />])}
        />
      </Card>
      <Card title="Access Mix" subtitle="Dummy report visualization">
        <div className="grid gap-4 pt-4 sm:grid-cols-3">
          {[
            ['Students', '72%', 'bg-cyan-500'],
            ['Faculty', '18%', 'bg-slate-900'],
            ['Staff', '10%', 'bg-amber-500'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className={`mb-4 h-2 rounded-full ${color}`}></div>
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Reports

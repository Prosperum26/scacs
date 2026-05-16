import StatusBadge from './StatusBadge'
import { useDemo } from '../context/demoContext'

function DemoActivityFeed() {
  const { activities } = useDemo()

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{activity.name}</p>
            <p className="text-xs text-slate-500">
              {activity.userId} • {activity.gate} • {activity.time}
            </p>
          </div>
          <StatusBadge value={activity.result} />
        </div>
      ))}
    </div>
  )
}

export default DemoActivityFeed

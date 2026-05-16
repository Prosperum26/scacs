import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DemoContext } from './demoContext'
import type { ActivityItem, Toast } from './demoContext'

const initialActivities: ActivityItem[] = [
  { id: 1, name: 'Linh Tran', userId: 'SV2026001', gate: 'Main Gate A', result: 'GRANTED', time: 'Just now' },
  { id: 2, name: 'Unknown', userId: 'VISITOR-09', gate: 'Dormitory B', result: 'DENIED', time: '2 min ago' },
  { id: 3, name: 'Dr. An Pham', userId: 'FC1108', gate: 'Lab 3', result: 'GRANTED', time: '5 min ago' },
]

export function DemoProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities)
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Date.now()
      setToasts((current) => [{ ...toast, id }, ...current].slice(0, 3))
      window.setTimeout(() => removeToast(id), 3400)
    },
    [removeToast],
  )

  const addActivity = useCallback((activity: Omit<ActivityItem, 'id' | 'time'>) => {
    setActivities((current) => [{ ...activity, id: Date.now(), time: 'Just now' }, ...current].slice(0, 6))
  }, [])

  const value = useMemo(
    () => ({ activities, addActivity, pushToast, removeToast, toasts }),
    [activities, addActivity, pushToast, removeToast, toasts],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

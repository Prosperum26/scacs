import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export type Toast = {
  id: number
  title: string
  message: string
  tone: ToastTone
}

export type ActivityItem = {
  id: number
  name: string
  userId: string
  gate: string
  result: 'GRANTED' | 'DENIED'
  time: string
}

export type DemoContextValue = {
  activities: ActivityItem[]
  addActivity: (activity: Omit<ActivityItem, 'id' | 'time'>) => void
  pushToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: number) => void
  toasts: Toast[]
}

export const DemoContext = createContext<DemoContextValue | null>(null)

export function useDemo() {
  const context = useContext(DemoContext)

  if (!context) {
    throw new Error('useDemo must be used within DemoProvider')
  }

  return context
}

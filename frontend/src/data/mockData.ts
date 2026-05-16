import type { NavItem } from '../types/navigation'

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Scanner', path: '/scanner' },
  { label: 'Users', path: '/users' },
  { label: 'Logs', path: '/logs' },
  { label: 'Reports', path: '/reports' },
]

export const reportRows = [
  { name: 'Daily Access Summary', owner: 'Security Office', updated: 'Today, 09:00', status: 'Ready' },
  { name: 'Denied Attempts by Gate', owner: 'Access Control', updated: 'Today, 08:30', status: 'Draft' },
  { name: 'Active Credential Audit', owner: 'IT Admin', updated: 'Yesterday, 17:45', status: 'Ready' },
  { name: 'Peak Hour Analysis', owner: 'Operations', updated: 'May 14, 2026', status: 'Scheduled' },
]

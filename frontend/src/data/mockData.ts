import type { NavItem } from '../types/navigation'

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Scanner', path: '/scanner' },
  { label: 'Users', path: '/users' },
  { label: 'Logs', path: '/logs' },
  { label: 'Reports', path: '/reports' },
]

export const stats = [
  { label: 'Total Entries Today', value: '1,284', change: '+12.4%', tone: 'text-emerald-700' },
  { label: 'Denied Access', value: '37', change: '-4.8%', tone: 'text-rose-700' },
  { label: 'Active Users', value: '8,942', change: '+2.1%', tone: 'text-sky-700' },
  { label: 'Active Gates', value: '18 / 20', change: '2 offline', tone: 'text-amber-700' },
]

export const users = [
  { id: 'SV2026001', name: 'Linh Tran', role: 'Student', department: 'Computer Science', status: 'Active' },
  { id: 'SV2026042', name: 'Minh Nguyen', role: 'Student', department: 'Business', status: 'Active' },
  { id: 'FC1108', name: 'Dr. An Pham', role: 'Faculty', department: 'Engineering', status: 'Active' },
  { id: 'ST3302', name: 'Bao Le', role: 'Staff', department: 'Library', status: 'Suspended' },
  { id: 'SV2026128', name: 'Hanh Vo', role: 'Student', department: 'Design', status: 'Active' },
]

export const logs = [
  { time: '08:04:12', user: 'Linh Tran', gate: 'Main Gate A', result: 'Granted', method: 'QR' },
  { time: '08:09:27', user: 'Unknown ID', gate: 'Dormitory B', result: 'Denied', method: 'Manual' },
  { time: '08:17:43', user: 'Dr. An Pham', gate: 'Lab 3', result: 'Granted', method: 'Card' },
  { time: '08:26:05', user: 'Bao Le', gate: 'Library East', result: 'Denied', method: 'QR' },
  { time: '08:31:49', user: 'Minh Nguyen', gate: 'Main Gate B', result: 'Granted', method: 'QR' },
  { time: '08:44:18', user: 'Hanh Vo', gate: 'Studio 2', result: 'Granted', method: 'Card' },
]

export const reportRows = [
  { name: 'Daily Access Summary', owner: 'Security Office', updated: 'Today, 09:00', status: 'Ready' },
  { name: 'Denied Attempts by Gate', owner: 'Access Control', updated: 'Today, 08:30', status: 'Draft' },
  { name: 'Active Credential Audit', owner: 'IT Admin', updated: 'Yesterday, 17:45', status: 'Ready' },
  { name: 'Peak Hour Analysis', owner: 'Operations', updated: 'May 14, 2026', status: 'Scheduled' },
]

export const hourlyTraffic = [42, 68, 91, 74, 58, 83, 112, 96]

export const gateHealth = [
  { gate: 'Main A', value: 98 },
  { gate: 'Main B', value: 94 },
  { gate: 'Dorm B', value: 72 },
  { gate: 'Library', value: 88 },
]

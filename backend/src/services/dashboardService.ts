import { getAccessLogs } from './accessLogService';
import { getUsers } from './userService';

const isToday = (timestamp: string): boolean => {
  const date = new Date(timestamp);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

export const getDashboardStats = () => {
  const users = getUsers();
  const logs = getAccessLogs();
  const todaysLogs = logs.filter((log) => isToday(log.timestamp));

  return {
    stats: [
      {
        label: 'Total Entries Today',
        value: String(todaysLogs.length),
        change: 'Live',
        tone: 'text-emerald-700',
      },
      {
        label: 'Denied Access',
        value: String(todaysLogs.filter((log) => log.result === 'DENIED').length),
        change: 'Today',
        tone: 'text-rose-700',
      },
      {
        label: 'Active Users',
        value: String(users.filter((user) => user.status === 'active').length),
        change: 'Active',
        tone: 'text-sky-700',
      },
      {
        label: 'Active Gates',
        value: '18 / 20',
        change: '2 offline',
        tone: 'text-amber-700',
      },
    ],
    hourlyTraffic: [42, 68, 91, 74, 58, 83, 112, 96],
    gateHealth: [
      { gate: 'Main A', value: 98 },
      { gate: 'Main B', value: 94 },
      { gate: 'Dorm B', value: 72 },
      { gate: 'Library', value: 88 },
    ],
  };
};

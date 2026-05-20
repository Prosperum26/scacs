import { AccessLog } from '../models/AccessLog';
import { User } from '../models/User';

export const getDashboardAnalytics = async () => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const [dailyCheckIns, deniedToday, activeStudents, logsToday] = await Promise.all([
    AccessLog.countDocuments({ status: 'GRANTED', timestamp: { $gte: startOfDay } }),
    AccessLog.countDocuments({ status: 'DENIED', timestamp: { $gte: startOfDay } }),
    User.countDocuments({ role: 'student', status: 'active' }),
    AccessLog.find({ timestamp: { $gte: startOfDay } }).lean(),
  ]);

  const hourlyMap = new Map<number, { granted: number; denied: number }>();
  for (let h = 0; h < 24; h++) hourlyMap.set(h, { granted: 0, denied: 0 });

  const gateMap = new Map<string, number>();

  for (const log of logsToday) {
    const hour = new Date(log.timestamp).getHours();
    const entry = hourlyMap.get(hour)!;
    if (log.status === 'GRANTED') entry.granted += 1;
    else entry.denied += 1;
    gateMap.set(log.gate, (gateMap.get(log.gate) ?? 0) + 1);
  }

  const hourlyStats = Array.from(hourlyMap.entries()).map(([hour, counts]) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    granted: counts.granted,
    denied: counts.denied,
    total: counts.granted + counts.denied,
  }));

  const gateTraffic = Array.from(gateMap.entries())
    .map(([gate, count]) => ({ gate, count }))
    .sort((a, b) => b.count - a.count);

  const last7Days = await AccessLog.aggregate([
    {
      $match: {
        timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        status: 'GRANTED',
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    dailyCheckIns,
    deniedToday,
    activeStudents,
    hourlyStats,
    gateTraffic,
    dailyTrend: last7Days.map((d) => ({ date: d._id, count: d.count })),
  };
};

import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { config } from '../config/environment';
import { processQrScan, getRecentLogs, getStudentHistory } from '../services/accessService';

export const verifyQr = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { qrToken, gate } = req.body;
    if (!qrToken) {
      res.status(400).json({ success: false, message: 'QR token required' });
      return;
    }
    const result = await processQrScan({
      qrToken,
      gate: gate ?? config.defaultGate,
      scannedBy: req.user,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err instanceof Error ? err.message : 'Scan failed' });
  }
};

export const getLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  const limit = parseInt(String(req.query.limit ?? '50'), 10);
  const logs = await getRecentLogs(limit);
  res.json({
    success: true,
    data: logs.map((l) => ({
      id: String(l._id),
      status: l.status,
      reason: l.reason,
      studentId: l.studentId,
      studentName: l.studentName,
      gate: l.gate,
      timestamp: l.timestamp,
      user: null,
    })),
  });
};

export const getMyHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const { from, to, status } = req.query;
  let logs = await getStudentHistory(req.user.studentId, 200);

  if (status === 'GRANTED' || status === 'DENIED') {
    logs = logs.filter((l) => l.status === status);
  }
  if (from) {
    const fromDate = new Date(String(from));
    logs = logs.filter((l) => new Date(l.timestamp) >= fromDate);
  }
  if (to) {
    const toDate = new Date(String(to));
    logs = logs.filter((l) => new Date(l.timestamp) <= toDate);
  }

  res.json({
    success: true,
    data: logs.map((l) => ({
      id: l._id.toString(),
      time: l.timestamp,
      gate: l.gate,
      status: l.status === 'GRANTED' ? 'Granted' : 'Denied',
      method: l.method,
      reason: l.reason,
    })),
  });
};

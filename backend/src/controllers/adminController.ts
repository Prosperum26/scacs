import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Alert } from '../models/Alert';
import { Gate } from '../models/Gate';
import { toPublicUser } from '../services/authService';
import { resetUserQrSessions, invalidateUserSessions } from '../services/qrService';
import { getDashboardAnalytics } from '../services/analyticsService';

export const listStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  const { q, department, status } = req.query;
  const filter: Record<string, unknown> = { role: 'student' };
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (q) {
    filter.$or = [
      { fullName: { $regex: String(q), $options: 'i' } },
      { studentId: { $regex: String(q), $options: 'i' } },
      { email: { $regex: String(q), $options: 'i' } },
    ];
  }
  const students = await User.find(filter).sort({ fullName: 1 }).lean();
  res.json({
    success: true,
    data: students.map((s) => ({
      id: s._id.toString(),
      studentId: s.studentId,
      name: s.fullName,
      department: s.department,
      status: s.status,
      email: s.email,
    })),
  });
};

export const updateStudentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.body;
  if (!['active', 'inactive', 'suspended'].includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid status' });
    return;
  }
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'student' },
    { status },
    { new: true },
  );
  if (!user) {
    res.status(404).json({ success: false, message: 'Student not found' });
    return;
  }
  if (status !== 'active') await invalidateUserSessions(user._id.toString());
  res.json({ success: true, data: toPublicUser(user) });
};

export const resetStudentQr = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!user) {
    res.status(404).json({ success: false, message: 'Student not found' });
    return;
  }
  await resetUserQrSessions(user._id.toString());
  res.json({ success: true, message: 'QR sessions reset' });
};

export const getAnalytics = async (_req: AuthRequest, res: Response): Promise<void> => {
  const data = await getDashboardAnalytics();
  res.json({ success: true, data });
};

export const getAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  const resolved = req.query.resolved === 'true';
  const alerts = await Alert.find({ resolved }).sort({ createdAt: -1 }).limit(50).lean();
  res.json({
    success: true,
    data: alerts.map((a) => ({
      id: a._id.toString(),
      type: a.type,
      severity: a.severity,
      title: a.title,
      message: a.message,
      studentId: a.studentId,
      gate: a.gate,
      resolved: a.resolved,
      createdAt: a.createdAt,
    })),
  });
};

export const resolveAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  await Alert.findByIdAndUpdate(req.params.id, { resolved: true });
  res.json({ success: true });
};

export const listGates = async (_req: AuthRequest, res: Response): Promise<void> => {
  const gates = await Gate.find().lean();
  res.json({ success: true, data: gates });
};

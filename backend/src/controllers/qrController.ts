import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { generateQrToken } from '../services/qrService';
import { getStudentStats } from '../services/accessService';
import { toPublicUser } from '../services/authService';

export const getMyQr = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    const qr = await generateQrToken(req.user);
    res.json({
      success: true,
      data: {
        ...qr,
        user: toPublicUser(req.user),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'QR generation failed' });
  }
};

export const getStudentDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const stats = await getStudentStats(req.user.studentId);
  res.json({
    success: true,
    data: {
      ...stats,
      user: toPublicUser(req.user),
      campusAccessLevel: req.user.accessLevel,
    },
  });
};

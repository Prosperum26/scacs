import type { Server as SocketServer } from 'socket.io';
import { AccessLog, type AccessStatus } from '../models/AccessLog';
import { Alert } from '../models/Alert';
import type { IUserDocument } from '../models/User';
import { verifyQrToken, type QrVerifyReason } from './qrService';

let io: SocketServer | null = null;

export const setSocketServer = (server: SocketServer): void => {
  io = server;
};

const reasonToMessage: Record<QrVerifyReason, string> = {
  valid: 'Access granted',
  invalid_token: 'Invalid QR code',
  expired: 'QR code expired',
  session_not_found: 'Unknown QR session',
  session_used: 'QR already used — request fresh code',
  session_invalidated: 'QR session invalidated',
  user_not_found: 'User not found',
  user_inactive: 'Account inactive or suspended',
};

const emitScan = (log: Record<string, unknown>): void => {
  io?.emit('scan:result', log);
  io?.emit('logs:updated');
};

const trackFailedAttempts = async (studentId: string, gate: string): Promise<void> => {
  const since = new Date(Date.now() - 5 * 60 * 1000);
  const failed = await AccessLog.countDocuments({
    studentId,
    status: 'DENIED',
    timestamp: { $gte: since },
  });

  if (failed >= 3) {
    await Alert.create({
      type: 'failed_scans',
      severity: failed >= 5 ? 'high' : 'medium',
      title: 'Multiple failed scans',
      message: `${studentId} had ${failed + 1} denied attempts in 5 minutes at ${gate}`,
      studentId,
      gate,
    });
    io?.emit('alerts:new');
  }
};

export interface ScanInput {
  qrToken: string;
  gate: string;
  scannedBy?: IUserDocument;
}

export const processQrScan = async ({ qrToken, gate, scannedBy }: ScanInput) => {
  const verification = await verifyQrToken(qrToken);
  const status: AccessStatus = verification.valid ? 'GRANTED' : 'DENIED';
  const reason = reasonToMessage[verification.reason];

  const log = await AccessLog.create({
    userId: verification.user?._id,
    studentId: verification.user?.studentId ?? 'UNKNOWN',
    studentName: verification.user?.fullName ?? 'Unknown',
    gate,
    status,
    method: 'QR',
    reason: verification.valid ? undefined : reason,
    scannedBy: scannedBy?._id,
  });

  if (!verification.valid) {
    if (verification.reason === 'session_used') {
      await Alert.create({
        type: 'duplicate_qr',
        severity: 'medium',
        title: 'Duplicate QR scan attempt',
        message: `Reused QR detected for ${verification.user?.studentId ?? 'unknown'} at ${gate}`,
        studentId: verification.user?.studentId,
        gate,
      });
      io?.emit('alerts:new');
    }
    if (verification.reason === 'expired') {
      await Alert.create({
        type: 'expired_token_abuse',
        severity: 'low',
        title: 'Expired QR scanned',
        message: `Expired token scan at ${gate}`,
        gate,
      });
    }
    await trackFailedAttempts(log.studentId, gate);
  }

  const payload = {
    id: log._id.toString(),
    status: log.status,
    reason: log.reason,
    studentId: log.studentId,
    studentName: log.studentName,
    gate: log.gate,
    timestamp: log.timestamp,
    user: verification.user
      ? {
          id: verification.user._id.toString(),
          fullName: verification.user.fullName,
          studentId: verification.user.studentId,
          department: verification.user.department,
          avatarUrl:
            verification.user.avatarUrl ??
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${verification.user.studentId}`,
        }
      : null,
  };

  emitScan(payload);
  return payload;
};

export const getStudentHistory = async (studentId: string, limit = 50) => {
  return AccessLog.find({ studentId }).sort({ timestamp: -1 }).limit(limit).lean();
};

export const getRecentLogs = async (limit = 30) => {
  return AccessLog.find().sort({ timestamp: -1 }).limit(limit).lean();
};

export const getStudentStats = async (studentId: string) => {
  const granted = await AccessLog.countDocuments({ studentId, status: 'GRANTED' });
  const last = await AccessLog.findOne({ studentId, status: 'GRANTED' }).sort({ timestamp: -1 }).lean();
  return {
    totalCheckIns: granted,
    lastAccessTime: last?.timestamp ?? null,
    activeQrStatus: 'Ready',
  };
};

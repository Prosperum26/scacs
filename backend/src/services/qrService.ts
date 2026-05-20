import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/environment';
import { QrSession, type IQrSessionDocument } from '../models/QrSession';
import { User, type IUserDocument } from '../models/User';

/** Prefix for compact QR payloads (easy for low-res webcams). */
export const QR_PAYLOAD_PREFIX = 'SC:';

/** ~15 characters in QR vs ~200+ for JWT — much larger modules on screen. */
export const generatePublicCode = (): string => randomBytes(6).toString('hex');

export interface QrPayload {
  sub: string;
  sid: string;
  jti: string;
  iat: number;
  exp: number;
}

export interface QrTokenResponse {
  qrToken: string;
  expiresAt: string;
  expiresInSec: number;
  sessionId: string;
}

export const invalidateUserSessions = async (userId: string): Promise<void> => {
  await QrSession.updateMany({ userId, invalidated: false }, { $set: { invalidated: true } });
};

export const generateQrToken = async (user: IUserDocument): Promise<QrTokenResponse> => {
  if (user.status !== 'active') {
    throw new Error('Account is not active');
  }

  await invalidateUserSessions(user._id.toString());

  const jti = uuidv4();
  const publicCode = generatePublicCode();
  const expiresInSec = config.qr.expirySec;
  const expiresAt = new Date(Date.now() + expiresInSec * 1000);

  const session = await QrSession.create({
    userId: user._id,
    jti,
    publicCode,
    expiresAt,
    version: Date.now(),
  });

  const qrToken = `${QR_PAYLOAD_PREFIX}${publicCode}`;

  return {
    qrToken,
    expiresAt: expiresAt.toISOString(),
    expiresInSec,
    sessionId: session._id.toString(),
  };
};

export type QrVerifyReason =
  | 'valid'
  | 'invalid_token'
  | 'expired'
  | 'session_not_found'
  | 'session_used'
  | 'session_invalidated'
  | 'user_not_found'
  | 'user_inactive';

export interface QrVerifyResult {
  valid: boolean;
  reason: QrVerifyReason;
  user?: IUserDocument;
  payload?: QrPayload;
}

const validateSession = async (session: IQrSessionDocument | null): Promise<QrVerifyResult> => {
  if (!session) return { valid: false, reason: 'session_not_found' };
  if (session.invalidated) return { valid: false, reason: 'session_invalidated' };
  if (session.usedAt) {
    const usedUser = await User.findById(session.userId);
    return { valid: false, reason: 'session_used', user: usedUser ?? undefined };
  }
  if (session.expiresAt < new Date()) return { valid: false, reason: 'expired' };

  const user = await User.findById(session.userId);
  if (!user) return { valid: false, reason: 'user_not_found' };
  if (user.status !== 'active') return { valid: false, reason: 'user_inactive', user };

  session.usedAt = new Date();
  await session.save();

  return {
    valid: true,
    reason: 'valid',
    user,
    payload: {
      sub: user._id.toString(),
      sid: session._id.toString(),
      jti: session.jti,
      iat: Math.floor(session.createdAt.getTime() / 1000),
      exp: Math.floor(session.expiresAt.getTime() / 1000),
    },
  };
};

const resolvePublicCode = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (trimmed.startsWith(QR_PAYLOAD_PREFIX)) {
    return trimmed.slice(QR_PAYLOAD_PREFIX.length).toLowerCase();
  }
  if (/^[a-f0-9]{12}$/i.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  return null;
};

/** Verify compact SC: code or legacy JWT (older clients). */
export const verifyQrToken = async (qrToken: string): Promise<QrVerifyResult> => {
  const trimmed = qrToken.trim();
  const publicCode = resolvePublicCode(trimmed);

  if (publicCode) {
    const session = await QrSession.findOne({ publicCode });
    return validateSession(session);
  }

  if (trimmed.includes('.')) {
    let payload: QrPayload;
    try {
      payload = jwt.verify(trimmed, config.jwt.secret) as QrPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return { valid: false, reason: 'expired' };
      }
      return { valid: false, reason: 'invalid_token' };
    }
    const session = await QrSession.findOne({ jti: payload.jti });
    return validateSession(session);
  }

  return { valid: false, reason: 'invalid_token' };
};

export const resetUserQrSessions = async (userId: string): Promise<void> => {
  await invalidateUserSessions(userId);
};

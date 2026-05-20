import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/environment';
import { QrSession } from '../models/QrSession';
import { User, type IUserDocument } from '../models/User';

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
  const expiresInSec = config.qr.expirySec;
  const expiresAt = new Date(Date.now() + expiresInSec * 1000);

  const session = await QrSession.create({
    userId: user._id,
    jti,
    expiresAt,
    version: Date.now(),
  });

  const qrToken = jwt.sign(
    {
      sub: user._id.toString(),
      sid: session._id.toString(),
      jti,
      typ: 'scacs_qr',
    },
    config.jwt.secret,
    { expiresIn: expiresInSec },
  );

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

export const verifyQrToken = async (qrToken: string): Promise<QrVerifyResult> => {
  let payload: QrPayload;
  try {
    payload = jwt.verify(qrToken, config.jwt.secret) as QrPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { valid: false, reason: 'expired' };
    }
    return { valid: false, reason: 'invalid_token' };
  }

  const session = await QrSession.findOne({ jti: payload.jti });
  if (!session) return { valid: false, reason: 'session_not_found' };
  if (session.invalidated) return { valid: false, reason: 'session_invalidated' };
  if (session.usedAt) {
    const usedUser = await User.findById(session.userId);
    return { valid: false, reason: 'session_used', user: usedUser ?? undefined };
  }
  if (session.expiresAt < new Date()) return { valid: false, reason: 'expired' };

  const user = await User.findById(payload.sub);
  if (!user) return { valid: false, reason: 'user_not_found' };
  if (user.status !== 'active') return { valid: false, reason: 'user_inactive', user };

  session.usedAt = new Date();
  await session.save();

  return { valid: true, reason: 'valid', user, payload };
};

export const resetUserQrSessions = async (userId: string): Promise<void> => {
  await invalidateUserSessions(userId);
  await User.findByIdAndUpdate(userId, { $inc: { rememberTokenVersion: 0 } });
};

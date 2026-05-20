import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { User, type IUserDocument } from '../models/User';

export interface AuthPayload {
  sub: string;
  role: 'student' | 'admin';
  email: string;
  tv: number;
}

export interface AuthRequest extends Request {
  user?: IUserDocument;
  auth?: AuthPayload;
}

export const signAuthToken = (user: IUserDocument): string =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email, tv: user.rememberTokenVersion },
    config.jwt.secret,
    { expiresIn: config.jwt.expiry as jwt.SignOptions['expiresIn'] },
  );

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }
    const token = header.slice(7);
    const payload = jwt.verify(token, config.jwt.secret) as AuthPayload;
    const user = await User.findById(payload.sub);
    if (!user || user.rememberTokenVersion !== payload.tv) {
      res.status(401).json({ success: false, message: 'Session expired' });
      return;
    }
    req.user = user;
    req.auth = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireRole =
  (...roles: Array<'student' | 'admin'>) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Insufficient permissions' });
      return;
    }
    next();
  };

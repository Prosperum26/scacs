import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { login, registerStudent, toPublicUser } from '../services/authService';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, studentId, email, password, department } = req.body;
    if (!fullName || !studentId || !email || !password || !department) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }
    const { user, token } = await registerStudent({ fullName, studentId, email, password, department });
    res.status(201).json({ success: true, data: { user: toPublicUser(user), token } });
  } catch (err) {
    res.status(400).json({ success: false, message: err instanceof Error ? err.message : 'Registration failed' });
  }
};

export const studentLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password, 'student');
    res.json({ success: true, data: { user: toPublicUser(user), token } });
  } catch (err) {
    res.status(401).json({ success: false, message: err instanceof Error ? err.message : 'Login failed' });
  }
};

export const adminLogin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password, 'admin');
    res.json({ success: true, data: { user: toPublicUser(user), token } });
  } catch (err) {
    res.status(401).json({ success: false, message: err instanceof Error ? err.message : 'Login failed' });
  }
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({ success: true, data: { user: req.user ? toPublicUser(req.user) : null } });
};

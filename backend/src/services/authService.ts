import bcrypt from 'bcryptjs';
import { User, type IUserDocument } from '../models/User';
import { signAuthToken } from '../middleware/auth';

export interface RegisterInput {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  department: string;
}

export const registerStudent = async (input: RegisterInput): Promise<{ user: IUserDocument; token: string }> => {
  const existing = await User.findOne({
    $or: [{ email: input.email.toLowerCase() }, { studentId: input.studentId.toUpperCase() }],
  });
  if (existing) {
    throw new Error('Email or Student ID already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    email: input.email.toLowerCase(),
    passwordHash,
    fullName: input.fullName,
    studentId: input.studentId.toUpperCase(),
    department: input.department,
    role: 'student',
    status: 'active',
    accessLevel: 'Standard Campus',
  });

  return { user, token: signAuthToken(user) };
};

export const login = async (
  email: string,
  password: string,
  role?: 'student' | 'admin',
): Promise<{ user: IUserDocument; token: string }> => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error('Invalid email or password');

  if (role && user.role !== role) {
    throw new Error(role === 'admin' ? 'Admin access only' : 'Student access only');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password');

  if (user.status !== 'active' && user.role === 'student') {
    throw new Error('Account is not active');
  }

  return { user, token: signAuthToken(user) };
};

export const toPublicUser = (user: IUserDocument) => ({
  id: user._id.toString(),
  email: user.email,
  fullName: user.fullName,
  studentId: user.studentId,
  department: user.department,
  role: user.role,
  status: user.status,
  avatarUrl: user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.studentId}`,
  accessLevel: user.accessLevel,
  createdAt: user.createdAt,
});

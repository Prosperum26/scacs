import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type UserRole = 'student' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface IUser {
  email: string;
  passwordHash: string;
  fullName: string;
  studentId: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  accessLevel: string;
  rememberTokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    avatarUrl: { type: String },
    accessLevel: { type: String, default: 'Standard Campus' },
    rememberTokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.index({ role: 1, status: 1 });
userSchema.index({ department: 1 });

export const User: Model<IUserDocument> =
  mongoose.models.User ?? mongoose.model<IUserDocument>('User', userSchema);

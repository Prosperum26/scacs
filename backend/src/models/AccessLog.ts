import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type AccessStatus = 'GRANTED' | 'DENIED';
export type AccessMethod = 'QR' | 'MANUAL';

export interface IAccessLog {
  userId?: mongoose.Types.ObjectId;
  studentId: string;
  studentName: string;
  gate: string;
  status: AccessStatus;
  method: AccessMethod;
  reason?: string;
  scannedBy?: mongoose.Types.ObjectId;
  timestamp: Date;
}

export interface IAccessLogDocument extends IAccessLog, Document {}

const accessLogSchema = new Schema<IAccessLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, required: true },
    gate: { type: String, required: true, index: true },
    status: { type: String, enum: ['GRANTED', 'DENIED'], required: true, index: true },
    method: { type: String, enum: ['QR', 'MANUAL'], default: 'QR' },
    reason: { type: String },
    scannedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false },
);

accessLogSchema.index({ timestamp: -1 });

export const AccessLog: Model<IAccessLogDocument> =
  mongoose.models.AccessLog ?? mongoose.model<IAccessLogDocument>('AccessLog', accessLogSchema);

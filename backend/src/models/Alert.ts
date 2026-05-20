import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type AlertSeverity = 'low' | 'medium' | 'high';
export type AlertType =
  | 'failed_scans'
  | 'suspicious_activity'
  | 'duplicate_qr'
  | 'expired_token_abuse';

export interface IAlert {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  studentId?: string;
  gate?: string;
  resolved: boolean;
  createdAt: Date;
}

export interface IAlertDocument extends IAlert, Document {}

const alertSchema = new Schema<IAlertDocument>(
  {
    type: {
      type: String,
      enum: ['failed_scans', 'suspicious_activity', 'duplicate_qr', 'expired_token_abuse'],
      required: true,
    },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    studentId: { type: String },
    gate: { type: String },
    resolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

export const Alert: Model<IAlertDocument> =
  mongoose.models.Alert ?? mongoose.model<IAlertDocument>('Alert', alertSchema);

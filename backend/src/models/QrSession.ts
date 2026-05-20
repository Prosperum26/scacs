import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IQrSession {
  userId: mongoose.Types.ObjectId;
  jti: string;
  expiresAt: Date;
  usedAt?: Date;
  invalidated: boolean;
  version: number;
  createdAt: Date;
}

export interface IQrSessionDocument extends IQrSession, Document {}

const qrSessionSchema = new Schema<IQrSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jti: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date },
    invalidated: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

qrSessionSchema.index({ userId: 1, invalidated: 1 });

export const QrSession: Model<IQrSessionDocument> =
  mongoose.models.QrSession ?? mongoose.model<IQrSessionDocument>('QrSession', qrSessionSchema);

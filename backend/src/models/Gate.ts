import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IGate {
  name: string;
  zone: string;
  status: 'active' | 'maintenance';
}

export interface IGateDocument extends IGate, Document {}

const gateSchema = new Schema<IGateDocument>(
  {
    name: { type: String, required: true, unique: true },
    zone: { type: String, required: true },
    status: { type: String, enum: ['active', 'maintenance'], default: 'active' },
  },
  { timestamps: true },
);

export const Gate: Model<IGateDocument> =
  mongoose.models.Gate ?? mongoose.model<IGateDocument>('Gate', gateSchema);

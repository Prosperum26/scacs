import dotenv from 'dotenv';
import { parseCorsOrigins } from './corsOrigins';

dotenv.config();

const corsOriginRaw = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/scacs',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'scacs-dev-secret-change-in-production',
    expiry: process.env.JWT_EXPIRY ?? '7d',
  },
  qr: {
    expirySec: parseInt(process.env.QR_TOKEN_EXPIRY_SEC ?? '60', 10),
  },
  cors: {
    origins: parseCorsOrigins(corsOriginRaw),
    origin: corsOriginRaw,
  },
  defaultGate: process.env.DEFAULT_GATE ?? 'Main Gate',
};

import cors from 'cors';
import type { CorsOptions } from 'cors';
import { config } from '../config/environment';
import { isOriginAllowed } from '../config/corsOrigins';

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin, config.cors.origins)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};

export const initializeCors = () => cors(corsOptions);

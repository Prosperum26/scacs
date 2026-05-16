/**
 * CORS Middleware Configuration
 * Handles Cross-Origin Resource Sharing settings
 */

import cors from 'cors';
import { config } from '../config/environment';

/**
 * CORS configuration for the application
 * Allows requests from the specified origin (frontend)
 */
export const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
};

/**
 * Initialize CORS middleware
 */
export const initializeCors = () => cors(corsOptions);

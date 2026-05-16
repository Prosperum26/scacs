/**
 * Environment Configuration
 * Load and validate environment variables for the application
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  database: {
    url: string;
    supabaseUrl: string;
    supabaseKey: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiry: string;
  };
  cors: {
    origin: string;
  };
}

/**
 * Get environment configuration
 * Validates required variables are present
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    port,
    nodeEnv,
    database: {
      url: process.env.DATABASE_URL || '',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || '',
    },
    auth: {
      jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
      jwtExpiry: process.env.JWT_EXPIRY || '7d',
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    },
  };
};

export const config = getEnvironmentConfig();

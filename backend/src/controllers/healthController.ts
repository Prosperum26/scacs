/**
 * Health Check Controller
 * Handles health check and status endpoints
 */

import { Request, Response } from 'express';

/**
 * Health check endpoint
 * Returns a simple status response to verify the API is running
 */
export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    message: 'SCACS API running',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
};

/**
 * Status endpoint with more detailed information
 */
export const getStatus = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    service: 'SCACS Backend',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};

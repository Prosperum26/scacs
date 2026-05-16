/**
 * Express Application Setup
 * This file configures the Express app with all middleware and routes
 */

import express, { Express } from 'express';
import { initializeCors } from './middleware/corsMiddleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import accessRoutes from './routes/accessRoutes';
import healthRoutes from './routes/healthRoutes';
import logRoutes from './routes/logRoutes';
import userRoutes from './routes/userRoutes';
import { logger } from './utils/logger';

/**
 * Create and configure the Express application
 */
export const createApp = (): Express => {
  const app = express();

  // ============================================
  // MIDDLEWARE SETUP
  // ============================================

  // Parse JSON request bodies (max 10kb)
  app.use(express.json({ limit: '10kb' }));

  // Parse URL-encoded request bodies (max 10kb)
  app.use(express.urlencoded({ limit: '10kb', extended: true }));

  // CORS middleware - Allow requests from frontend
  app.use(initializeCors());

  // Request logging middleware (optional - can be expanded)
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // ============================================
  // ROUTES SETUP
  // ============================================

  app.use('/', healthRoutes);
  app.use('/users', userRoutes);
  app.use('/access', accessRoutes);
  app.use('/logs', logRoutes);

  // ============================================
  // ERROR HANDLING
  // ============================================

  // 404 Not Found middleware (must be after all routes)
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};

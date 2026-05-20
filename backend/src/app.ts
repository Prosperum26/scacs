import express, { Express } from 'express';
import { initializeCors } from './middleware/corsMiddleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import qrRoutes from './routes/qrRoutes';
import accessRoutes from './routes/accessRoutes';
import adminRoutes from './routes/adminRoutes';
import healthRoutes from './routes/healthRoutes';
import { logger } from './utils/logger';

export const createApp = (): Express => {
  const app = express();

  app.use(express.json({ limit: '50kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(initializeCors());

  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  app.use('/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/qr', qrRoutes);
  app.use('/api/access', accessRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

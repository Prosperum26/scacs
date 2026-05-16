/**
 * Server Startup
 * This file starts the Express server and handles graceful shutdown
 */

import { createApp } from './app';
import { config } from './config/environment';
import { logger } from './utils/logger';

/**
 * Start the server
 */
const startServer = (): void => {
  try {
    const app = createApp();

    app.listen(config.port, () => {
      logger.success('SCACS Backend Server Started', {
        port: config.port,
        environment: config.nodeEnv,
        url: `http://localhost:${config.port}`,
      });

      logger.info('Available endpoints:');
      logger.info('  GET    http://localhost:' + config.port);
      logger.info('  GET    http://localhost:' + config.port + '/status');
      logger.info('  GET    http://localhost:' + config.port + '/users');
      logger.info('  POST   http://localhost:' + config.port + '/users');
      logger.info('  PUT    http://localhost:' + config.port + '/users/:id');
      logger.info('  DELETE http://localhost:' + config.port + '/users/:id');
      logger.info('  POST   http://localhost:' + config.port + '/access/verify');
      logger.info('  GET    http://localhost:' + config.port + '/logs');
      logger.info('  GET    http://localhost:' + config.port + '/dashboard/stats');
    });

    process.on('SIGINT', () => {
      logger.warning('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      logger.warning('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

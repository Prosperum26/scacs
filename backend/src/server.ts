import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { createApp } from './app';
import { connectDatabase } from './config/database';
import { config } from './config/environment';
import { setSocketServer } from './services/accessService';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const app = createApp();
    const server = http.createServer(app);

    const io = new SocketServer(server, {
      cors: {
        origin: config.cors.origins,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      logger.info('Socket connected', { id: socket.id });
      socket.on('scanner:join', (gate: string) => {
        socket.join(`gate:${gate}`);
        socket.emit('scanner:ready', { gate });
      });
    });

    setSocketServer(io);

    server.listen(config.port, () => {
      logger.success('SCACS Backend started', {
        port: config.port,
        url: `http://localhost:${config.port}`,
        cors: config.cors.origin,
      });
    });

    const shutdown = () => {
      logger.warning('Shutting down...');
      server.close(() => process.exit(0));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

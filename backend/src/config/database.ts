import mongoose from 'mongoose';
import { config } from './environment';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongodbUri);
  logger.success('MongoDB connected', { uri: config.mongodbUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') });
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};

/**
 * Error Handler Middleware
 * Centralized error handling for the application
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom Error class for application errors
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Global error handler middleware
 * Should be placed as the last middleware in the app
 */
export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    logger.error(`Application Error: ${error.message}`, { statusCode: error.statusCode });
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      statusCode: error.statusCode,
    });
  } else {
    logger.error('Unexpected Error', { message: error.message });
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      statusCode: 500,
    });
  }
};

/**
 * 404 Not Found middleware
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    statusCode: 404,
  });
};

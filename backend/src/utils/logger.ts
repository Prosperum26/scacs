/**
 * Logger Utility
 * Simple logging utility for the application
 */

export enum LogLevel {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

/**
 * Color codes for console output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Format log message with timestamp and level
 */
const formatLogMessage = (
  level: LogLevel,
  message: string,
  data?: unknown
): string => {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level}] ${message}${dataStr}`;
};

/**
 * Logger object with methods for different log levels
 */
export const logger = {
  info: (message: string, data?: unknown): void => {
    const formatted = formatLogMessage(LogLevel.INFO, message, data);
    console.log(`${colors.blue}${formatted}${colors.reset}`);
  },

  success: (message: string, data?: unknown): void => {
    const formatted = formatLogMessage(LogLevel.SUCCESS, message, data);
    console.log(`${colors.green}${formatted}${colors.reset}`);
  },

  error: (message: string, data?: unknown): void => {
    const formatted = formatLogMessage(LogLevel.ERROR, message, data);
    console.error(`${colors.red}${formatted}${colors.reset}`);
  },

  warning: (message: string, data?: unknown): void => {
    const formatted = formatLogMessage(LogLevel.WARNING, message, data);
    console.warn(`${colors.yellow}${formatted}${colors.reset}`);
  },
};

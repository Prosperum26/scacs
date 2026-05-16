import { Request, Response } from 'express';
import { getAccessLogs } from '../services/accessLogService';

export const getLogs = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: getAccessLogs(),
  });
};

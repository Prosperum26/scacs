import { NextFunction, Request, Response } from 'express';
import { getAccessLogs } from '../services/accessLogService';

export const getLogs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: await getAccessLogs(),
    });
  } catch (error) {
    next(error);
  }
};

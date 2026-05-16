import { NextFunction, Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboardService';

export const getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: await getDashboardStats(),
    });
  } catch (error) {
    next(error);
  }
};

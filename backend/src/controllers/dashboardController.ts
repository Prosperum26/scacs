import { Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboardService';

export const getDashboard = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: getDashboardStats(),
  });
};

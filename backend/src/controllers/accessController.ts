import { Request, Response } from 'express';
import { verifyAccess } from '../services/accessService';

interface VerifyAccessBody {
  studentId?: string;
  gate?: string;
}

export const verifyUserAccess = (req: Request<object, object, VerifyAccessBody>, res: Response): void => {
  const { studentId, gate } = req.body;

  if (!studentId) {
    res.status(400).json({
      success: false,
      message: 'studentId is required',
    });
    return;
  }

  const result = verifyAccess({ studentId, gate });

  res.status(200).json({
    success: true,
    data: result,
  });
};

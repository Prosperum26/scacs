import { Router } from 'express';
import { getMyQr, getStudentDashboard } from '../controllers/qrController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole('student'));
router.get('/token', getMyQr);
router.get('/dashboard', getStudentDashboard);

export default router;

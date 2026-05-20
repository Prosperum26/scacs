import { Router } from 'express';
import { getLogs, getMyHistory, verifyQr } from '../controllers/accessController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.post('/verify', authenticate, requireRole('admin'), verifyQr);
router.get('/logs', authenticate, requireRole('admin'), getLogs);
router.get('/history', authenticate, requireRole('student'), getMyHistory);

export default router;

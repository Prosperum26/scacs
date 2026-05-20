import { Router } from 'express';
import {
  getAlerts,
  getAnalytics,
  listGates,
  listStudents,
  resetStudentQr,
  resolveAlert,
  updateStudentStatus,
} from '../controllers/adminController';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireRole('admin'));
router.get('/students', listStudents);
router.patch('/students/:id/status', updateStudentStatus);
router.post('/students/:id/reset-qr', resetStudentQr);
router.get('/analytics', getAnalytics);
router.get('/alerts', getAlerts);
router.patch('/alerts/:id/resolve', resolveAlert);
router.get('/gates', listGates);

export default router;

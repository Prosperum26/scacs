import { Router } from 'express';
import { adminLogin, me, register, studentLogin } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login/student', studentLogin);
router.post('/login/admin', adminLogin);
router.get('/me', authenticate, me);

export default router;

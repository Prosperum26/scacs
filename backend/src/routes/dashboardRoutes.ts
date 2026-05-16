import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', getDashboard);

export default router;

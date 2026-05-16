import { Router } from 'express';
import { verifyUserAccess } from '../controllers/accessController';

const router = Router();

router.post('/verify', verifyUserAccess);

export default router;

import { Router } from 'express';
import { createNewUser, deleteExistingUser, getAllUsers, updateExistingUser } from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.post('/', createNewUser);
router.put('/:id', updateExistingUser);
router.delete('/:id', deleteExistingUser);

export default router;

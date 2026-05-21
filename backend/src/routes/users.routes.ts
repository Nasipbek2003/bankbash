import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
const usersController = new UsersController();

router.use(authenticate);

router.get('/', requireRole('ADMIN'), usersController.getUsers);

export default router;

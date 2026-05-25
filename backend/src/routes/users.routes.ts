import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
const usersController = new UsersController();

router.use(authenticate);
router.use(requireRole('ADMIN')); // Все операции доступны только администратору

// Получить список всех пользователей
router.get('/', usersController.getUsers);

// Получить пользователя по ID
router.get('/:id', usersController.getUserById);

// Создать нового пользователя
router.post('/', usersController.createUser);

// Обновить пользователя
router.put('/:id', usersController.updateUser);

// Удалить пользователя
router.delete('/:id', usersController.deleteUser);

// Переключить статус пользователя (активен/неактивен)
router.patch('/:id/toggle-status', usersController.toggleUserStatus);

export default router;

import { Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { z } from 'zod';
import { SystemUserRole } from '@prisma/client';

const usersService = new UsersService();

// Схемы валидации
const createUserSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа'),
  role: z.nativeEnum(SystemUserRole),
});

const updateUserSchema = z.object({
  email: z.string().email('Некорректный email').optional(),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов').optional(),
  fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа').optional(),
  role: z.nativeEnum(SystemUserRole).optional(),
  isActive: z.boolean().optional(),
});

export class UsersController {
  async getUsers(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await usersService.getUsers();

      res.json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await usersService.getUserById(id);

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const user = await usersService.createUser(validatedData);

      res.status(201).json({
        status: 'success',
        data: user,
        message: 'Пользователь успешно создан',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateUserSchema.parse(req.body);
      const user = await usersService.updateUser(id, validatedData);

      res.json({
        status: 'success',
        data: user,
        message: 'Пользователь успешно обновлен',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Запрещаем удалять самого себя
      if (req.user?.userId === id) {
        res.status(400).json({
          status: 'error',
          message: 'Вы не можете удалить свою учетную запись',
        });
        return;
      }

      const result = await usersService.deleteUser(id);

      res.json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleUserStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // Запрещаем деактивировать самого себя
      if (req.user?.userId === id) {
        res.status(400).json({
          status: 'error',
          message: 'Вы не можете изменить статус своей учетной записи',
        });
        return;
      }

      const user = await usersService.toggleUserStatus(id);

      res.json({
        status: 'success',
        data: user,
        message: `Пользователь ${user.isActive ? 'активирован' : 'деактивирован'}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

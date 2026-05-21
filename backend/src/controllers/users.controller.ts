import { Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service';
import { AuthRequest } from '../middleware/auth.middleware';

const usersService = new UsersService();

export class UsersController {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
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
}

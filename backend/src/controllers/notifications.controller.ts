import { Response, NextFunction } from 'express';
import { NotificationsService } from '../services/notifications.service';
import { AuthRequest } from '../middleware/auth.middleware';

const notificationsService = new NotificationsService();

export class NotificationsController {
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await notificationsService.getNotifications();

      res.json({
        status: 'success',
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const notification = await notificationsService.markAsRead(id);

      res.json({
        status: 'success',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }
}

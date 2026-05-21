import { prisma } from '../config/database';

export class NotificationsService {
  async getNotifications() {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    return notifications;
  }

  async markAsRead(id: string) {
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return notification;
  }
}

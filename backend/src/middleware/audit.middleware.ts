import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export const auditLog = (action: string, entity: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
      // Логируем только успешные операции
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const entityId = body?.id || req.params.id || null;

        prisma.auditLog
          .create({
            data: {
              userId: req.user.userId,
              action,
              entity,
              entityId,
              newValue: body || null,
              ipAddress: req.ip,
              userAgent: req.get('user-agent'),
            },
          })
          .catch((error) => {
            logger.error('Failed to create audit log:', error);
          });
      }

      return originalJson(body);
    };

    next();
  };
};

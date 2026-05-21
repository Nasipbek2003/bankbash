import { Router } from 'express';
import { ClientsController } from '../controllers/clients.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();
const clientsController = new ClientsController();

// Все маршруты требуют аутентификации
router.use(authenticate);

router.get('/', clientsController.getClients);
router.get('/:id', clientsController.getClientById);

// Только ADMIN и OPERATOR могут создавать и редактировать
router.post(
  '/',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('CREATE', 'CLIENT'),
  clientsController.createClient
);

router.put(
  '/:id',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('UPDATE', 'CLIENT'),
  clientsController.updateClient
);

router.patch(
  '/:id/status',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('UPDATE_STATUS', 'CLIENT'),
  clientsController.updateClientStatus
);

export default router;

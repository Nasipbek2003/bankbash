import { Router } from 'express';
import { TransactionsController } from '../controllers/transactions.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();
const transactionsController = new TransactionsController();

router.use(authenticate);

router.get('/', transactionsController.getTransactions);
router.get('/:id', transactionsController.getTransactionById);

router.post(
  '/:id/reverse',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('REVERSE', 'TRANSACTION'),
  transactionsController.reverseTransaction
);

export default router;

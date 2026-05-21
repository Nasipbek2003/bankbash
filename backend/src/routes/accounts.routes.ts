import { Router } from 'express';
import { AccountsController } from '../controllers/accounts.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { auditLog } from '../middleware/audit.middleware';

const router = Router();
const accountsController = new AccountsController();

router.use(authenticate);

router.get('/', accountsController.getAccounts);
router.get('/:id', accountsController.getAccountById);

router.post(
  '/',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('CREATE', 'ACCOUNT'),
  accountsController.createAccount
);

router.patch(
  '/:id/status',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('UPDATE_STATUS', 'ACCOUNT'),
  accountsController.updateAccountStatus
);

router.post(
  '/:id/deposit',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('DEPOSIT', 'ACCOUNT'),
  accountsController.deposit
);

router.post(
  '/:id/withdraw',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('WITHDRAW', 'ACCOUNT'),
  accountsController.withdraw
);

router.post(
  '/transfer',
  requireRole('ADMIN', 'OPERATOR'),
  auditLog('TRANSFER', 'ACCOUNT'),
  accountsController.transfer
);

export default router;

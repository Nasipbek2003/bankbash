import { Router } from 'express';
import { ReportsController } from '../controllers/reports.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const reportsController = new ReportsController();

router.use(authenticate);

router.get('/turnover', reportsController.getTurnoverReport);
router.get('/clients', reportsController.getNewClientsReport);
router.get('/accounts', reportsController.getAccountsSummary);
router.get('/dashboard', reportsController.getDashboardStats);

export default router;

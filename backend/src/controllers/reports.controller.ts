import { Response, NextFunction } from 'express';
import { ReportsService } from '../services/reports.service';
import { AuthRequest } from '../middleware/auth.middleware';

const reportsService = new ReportsService();

export class ReportsController {
  async getTurnoverReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { dateFrom, dateTo } = req.query;

      if (!dateFrom || !dateTo) {
        res.status(400).json({
          status: 'error',
          message: 'dateFrom and dateTo are required',
        });
        return;
      }

      const report = await reportsService.getTurnoverReport(
        new Date(dateFrom as string),
        new Date(dateTo as string)
      );

      res.json({
        status: 'success',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async getNewClientsReport(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { dateFrom, dateTo } = req.query;

      if (!dateFrom || !dateTo) {
        res.status(400).json({
          status: 'error',
          message: 'dateFrom and dateTo are required',
        });
        return;
      }

      const report = await reportsService.getNewClientsReport(
        new Date(dateFrom as string),
        new Date(dateTo as string)
      );

      res.json({
        status: 'success',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAccountsSummary(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const summary = await reportsService.getAccountsSummary();

      res.json({
        status: 'success',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await reportsService.getDashboardStats();

      res.json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

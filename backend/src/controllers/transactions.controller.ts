import { Response, NextFunction } from 'express';
import { TransactionsService } from '../services/transactions.service';
import { AuthRequest } from '../middleware/auth.middleware';

const transactionsService = new TransactionsService();

export class TransactionsController {
  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        accountId,
        type,
        status,
        dateFrom,
        dateTo,
        amountMin,
        amountMax,
        page,
        limit,
      } = req.query;

      const result = await transactionsService.getTransactions({
        accountId: accountId as string,
        type: type as any,
        status: status as any,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined,
        amountMin: amountMin ? parseFloat(amountMin as string) : undefined,
        amountMax: amountMax ? parseFloat(amountMax as string) : undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await transactionsService.getTransactionById(id);

      res.json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async reverseTransaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const transaction = await transactionsService.reverseTransaction(id, reason);

      res.json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }
}

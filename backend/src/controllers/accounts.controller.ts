import { Response, NextFunction } from 'express';
import { AccountsService } from '../services/accounts.service';
import { AuthRequest } from '../middleware/auth.middleware';

const accountsService = new AccountsService();

export class AccountsController {
  async getAccounts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { clientId, type, status, currency, page, limit } = req.query;

      const result = await accountsService.getAccounts({
        clientId: clientId as string,
        type: type as any,
        status: status as any,
        currency: currency as any,
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

  async getAccountById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const account = await accountsService.getAccountById(id);

      res.json({
        status: 'success',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const account = await accountsService.createAccount(req.body);

      res.status(201).json({
        status: 'success',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAccountStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const account = await accountsService.updateAccountStatus(id, status);

      res.json({
        status: 'success',
        data: account,
      });
    } catch (error) {
      next(error);
    }
  }

  async deposit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { amount, description } = req.body;
      const transaction = await accountsService.deposit(id, amount, description);

      res.json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async withdraw(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { amount, description } = req.body;
      const transaction = await accountsService.withdraw(id, amount, description);

      res.json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  async transfer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { fromAccountId, toAccountId, amount, description } = req.body;
      const transaction = await accountsService.transfer(
        fromAccountId,
        toAccountId,
        amount,
        description
      );

      res.json({
        status: 'success',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }
}

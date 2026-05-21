import { Response, NextFunction } from 'express';
import { ClientsService } from '../services/clients.service';
import { AuthRequest } from '../middleware/auth.middleware';

const clientsService = new ClientsService();

export class ClientsController {
  async getClients(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, status, page, limit } = req.query;

      const result = await clientsService.getClients({
        search: search as string,
        status: status as any,
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

  async getClientById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const client = await clientsService.getClientById(id);

      res.json({
        status: 'success',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async createClient(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const client = await clientsService.createClient(req.body);

      res.status(201).json({
        status: 'success',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const client = await clientsService.updateClient(id, req.body);

      res.json({
        status: 'success',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClientStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const client = await clientsService.updateClientStatus(id, status);

      res.json({
        status: 'success',
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }
}

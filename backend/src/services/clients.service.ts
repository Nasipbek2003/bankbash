import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import { ClientStatus, KycStatus } from '@prisma/client';

export class ClientsService {
  async getClients(params: {
    search?: string;
    status?: ClientStatus;
    page?: number;
    limit?: number;
  }) {
    const { search, status, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        phone?: { contains: string; mode: 'insensitive' };
      }>;
      status?: ClientStatus;
    } = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { accounts: true },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return {
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getClientById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        accounts: {
          orderBy: { openedAt: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    return client;
  }

  async createClient(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    address?: string;
  }) {
    // Проверка на дубликаты
    const existing = await prisma.client.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existing) {
      throw new ConflictError('Client with this email or phone already exists');
    }

    const client = await prisma.client.create({
      data,
    });

    return client;
  }

  async updateClient(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      middleName?: string;
      dateOfBirth?: Date;
      email?: string;
      phone?: string;
      address?: string;
      kycStatus?: KycStatus;
    }
  ) {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    const updated = await prisma.client.update({
      where: { id },
      data,
    });

    return updated;
  }

  async updateClientStatus(id: string, status: ClientStatus) {
    const client = await prisma.client.findUnique({ where: { id } });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    const updated = await prisma.client.update({
      where: { id },
      data: { status },
    });

    return updated;
  }
}

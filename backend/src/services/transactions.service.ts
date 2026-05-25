import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { TransactionType, TransactionStatus } from '@prisma/client';

export class TransactionsService {
  async getTransactions(params: {
    accountId?: string;
    type?: TransactionType;
    status?: TransactionStatus;
    dateFrom?: Date;
    dateTo?: Date;
    amountMin?: number;
    amountMax?: number;
    page?: number;
    limit?: number;
  }) {
    const {
      accountId,
      type,
      status,
      dateFrom,
      dateTo,
      amountMin,
      amountMax,
      page = 1,
      limit = 10,
    } = params;
    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<{ fromAccountId: string } | { toAccountId: string }>;
      type?: TransactionType;
      status?: TransactionStatus;
      createdAt?: { gte?: Date; lte?: Date };
      amount?: { gte?: number; lte?: number };
    } = {};

    if (accountId) {
      where.OR = [{ fromAccountId: accountId }, { toAccountId: accountId }];
    }

    if (type) where.type = type;
    if (status) where.status = status;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    if (amountMin !== undefined || amountMax !== undefined) {
      where.amount = {};
      if (amountMin !== undefined) where.amount.gte = amountMin;
      if (amountMax !== undefined) where.amount.lte = amountMax;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          fromAccount: {
            select: {
              id: true,
              accountNumber: true,
              client: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          toAccount: {
            select: {
              id: true,
              accountNumber: true,
              client: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(id: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        fromAccount: {
          include: {
            client: true,
          },
        },
        toAccount: {
          include: {
            client: true,
          },
        },
        reversal: true,
        reversedBy: true,
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  async reverseTransaction(id: string, reason: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        fromAccount: true,
        toAccount: true,
      },
    });

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    if (transaction.status !== 'COMPLETED') {
      throw new BadRequestError('Only completed transactions can be reversed');
    }

    if (transaction.reversedById) {
      throw new BadRequestError('Transaction already reversed');
    }

    return await prisma.$transaction(async (tx) => {
      // Создаем реверсивную транзакцию
      const reversalTransaction = await tx.transaction.create({
        data: {
          type: 'REVERSAL',
          status: 'COMPLETED',
          amount: transaction.amount,
          currency: transaction.currency,
          description: `Reversal: ${reason}`,
          fromAccountId: transaction.toAccountId,
          toAccountId: transaction.fromAccountId,
        },
      });

      // Обновляем оригинальную транзакцию
      await tx.transaction.update({
        where: { id },
        data: {
          status: 'REVERSED',
          reversedById: reversalTransaction.id,
        },
      });

      // Возвращаем средства
      if (transaction.fromAccountId) {
        await tx.account.update({
          where: { id: transaction.fromAccountId },
          data: {
            balance: {
              increment: transaction.amount,
            },
          },
        });
      }

      if (transaction.toAccountId) {
        await tx.account.update({
          where: { id: transaction.toAccountId },
          data: {
            balance: {
              decrement: transaction.amount,
            },
          },
        });
      }

      return reversalTransaction;
    });
  }
}

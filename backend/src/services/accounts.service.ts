import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { AccountType, AccountStatus, Currency } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class AccountsService {
  async getAccounts(params: {
    clientId?: string;
    type?: AccountType;
    status?: AccountStatus;
    currency?: Currency;
    page?: number;
    limit?: number;
  }) {
    const { clientId, type, status, currency, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: {
      clientId?: string;
      type?: AccountType;
      status?: AccountStatus;
      currency?: Currency;
    } = {};

    if (clientId) where.clientId = clientId;
    if (type) where.type = type;
    if (status) where.status = status;
    if (currency) where.currency = currency;

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip,
        take: limit,
        orderBy: { openedAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.account.count({ where }),
    ]);

    return {
      accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAccountById(id: string) {
    const account = await prisma.account.findUnique({
      where: { id },
      include: {
        client: true,
        transactionsFrom: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        transactionsTo: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    return account;
  }

  async createAccount(data: {
    clientId: string;
    type: AccountType;
    currency: Currency;
    creditLimit?: number;
  }) {
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    // Генерация номера счета
    const accountNumber = await this.generateAccountNumber();

    const account = await prisma.account.create({
      data: {
        accountNumber,
        clientId: data.clientId,
        type: data.type,
        currency: data.currency,
        creditLimit: data.creditLimit,
      },
      include: {
        client: true,
      },
    });

    return account;
  }

  async updateAccountStatus(id: string, status: AccountStatus) {
    const account = await prisma.account.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    const updated = await prisma.account.update({
      where: { id },
      data: {
        status,
        closedAt: status === 'CLOSED' ? new Date() : null,
      },
    });

    return updated;
  }

  async deposit(accountId: string, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestError('Amount must be positive');
    }

    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    if (account.status !== 'ACTIVE') {
      throw new BadRequestError('Account is not active');
    }

    return await prisma.$transaction(async (tx) => {
      // Создаем транзакцию
      const transaction = await tx.transaction.create({
        data: {
          type: 'CREDIT',
          status: 'COMPLETED',
          amount: new Decimal(amount),
          currency: account.currency,
          description: description || 'Deposit',
          toAccountId: accountId,
        },
      });

      // Обновляем баланс
      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return transaction;
    });
  }

  async withdraw(accountId: string, amount: number, description?: string) {
    if (amount <= 0) {
      throw new BadRequestError('Amount must be positive');
    }

    const account = await prisma.account.findUnique({ where: { id: accountId } });

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    if (account.status !== 'ACTIVE') {
      throw new BadRequestError('Account is not active');
    }

    const newBalance = account.balance.toNumber() - amount;
    const creditLimit = account.creditLimit?.toNumber() || 0;

    if (newBalance < -creditLimit) {
      throw new BadRequestError('Insufficient funds');
    }

    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          type: 'DEBIT',
          status: 'COMPLETED',
          amount: new Decimal(amount),
          currency: account.currency,
          description: description || 'Withdrawal',
          fromAccountId: accountId,
        },
      });

      await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return transaction;
    });
  }

  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    description?: string
  ) {
    if (amount <= 0) {
      throw new BadRequestError('Amount must be positive');
    }

    if (fromAccountId === toAccountId) {
      throw new BadRequestError('Cannot transfer to the same account');
    }

    const [fromAccount, toAccount] = await Promise.all([
      prisma.account.findUnique({ where: { id: fromAccountId } }),
      prisma.account.findUnique({ where: { id: toAccountId } }),
    ]);

    if (!fromAccount || !toAccount) {
      throw new NotFoundError('Account not found');
    }

    if (fromAccount.status !== 'ACTIVE' || toAccount.status !== 'ACTIVE') {
      throw new BadRequestError('Both accounts must be active');
    }

    if (fromAccount.currency !== toAccount.currency) {
      throw new BadRequestError('Currency mismatch');
    }

    const newBalance = fromAccount.balance.toNumber() - amount;
    const creditLimit = fromAccount.creditLimit?.toNumber() || 0;

    if (newBalance < -creditLimit) {
      throw new BadRequestError('Insufficient funds');
    }

    return await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          type: 'TRANSFER',
          status: 'COMPLETED',
          amount: new Decimal(amount),
          currency: fromAccount.currency,
          description: description || 'Transfer',
          fromAccountId,
          toAccountId,
        },
      });

      await tx.account.update({
        where: { id: fromAccountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await tx.account.update({
        where: { id: toAccountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return transaction;
    });
  }

  private async generateAccountNumber(): Promise<string> {
    const prefix = '40817810';
    const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    return prefix + random;
  }
}

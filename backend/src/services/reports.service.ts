import { prisma } from '../config/database';

export class ReportsService {
  async getTurnoverReport(dateFrom: Date, dateTo: Date) {
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: dateFrom,
          lte: dateTo,
        },
        status: 'COMPLETED',
      },
      select: {
        type: true,
        amount: true,
        currency: true,
      },
    });

    const summary: Record<
      string,
      {
        type: string;
        currency: string;
        totalAmount: number;
        count: number;
      }
    > = {};

    transactions.forEach((tx) => {
      const key = `${tx.type}_${tx.currency}`;
      if (!summary[key]) {
        summary[key] = {
          type: tx.type,
          currency: tx.currency,
          totalAmount: 0,
          count: 0,
        };
      }
      summary[key].totalAmount += tx.amount.toNumber();
      summary[key].count += 1;
    });

    return Object.values(summary);
  }

  async getNewClientsReport(dateFrom: Date, dateTo: Date) {
    const clients = await prisma.client.findMany({
      where: {
        createdAt: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        kycStatus: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const summary = {
      total: clients.length,
      byStatus: {} as Record<string, number>,
      byKycStatus: {} as Record<string, number>,
    };

    clients.forEach((client) => {
      summary.byStatus[client.status] = (summary.byStatus[client.status] || 0) + 1;
      summary.byKycStatus[client.kycStatus] =
        (summary.byKycStatus[client.kycStatus] || 0) + 1;
    });

    return {
      summary,
      clients,
    };
  }

  async getAccountsSummary() {
    const accounts = await prisma.account.groupBy({
      by: ['type', 'status', 'currency'],
      _count: true,
      _sum: {
        balance: true,
      },
    });

    return accounts.map((item) => ({
      type: item.type,
      status: item.status,
      currency: item.currency,
      count: item._count,
      totalBalance: item._sum.balance?.toNumber() || 0,
    }));
  }

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalActiveAccounts,
      totalBalance,
      todayTransactions,
      newClientsThisMonth,
      blockedAccounts,
      recentTransactions,
    ] = await Promise.all([
      prisma.account.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.account.aggregate({
        where: { status: 'ACTIVE' },
        _sum: { balance: true },
      }),
      prisma.transaction.count({
        where: {
          createdAt: { gte: today },
          status: 'COMPLETED',
        },
      }),
      prisma.client.count({
        where: {
          createdAt: { gte: firstDayOfMonth },
        },
      }),
      prisma.account.count({
        where: { status: 'FROZEN' },
      }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          fromAccount: {
            select: {
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
    ]);

    return {
      totalActiveAccounts,
      totalBalance: totalBalance._sum.balance?.toNumber() || 0,
      todayTransactions,
      newClientsThisMonth,
      blockedAccounts,
      recentTransactions,
    };
  }
}

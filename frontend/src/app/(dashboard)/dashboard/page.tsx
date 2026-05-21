'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDateTime, getStatusColor, getTransactionTypeLabel } from '@/lib/utils';
import { DashboardStats } from '@/types';
import { TrendingUp, Users, CreditCard, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get<{ status: string; data: DashboardStats }>('/reports/dashboard');
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-background rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Активные счета',
      value: data?.totalActiveAccounts || 0,
      icon: CreditCard,
      color: 'text-accent',
    },
    {
      title: 'Общий баланс',
      value: formatCurrency(data?.totalBalance || 0),
      icon: TrendingUp,
      color: 'text-success',
    },
    {
      title: 'Транзакций сегодня',
      value: data?.todayTransactions || 0,
      icon: TrendingUp,
      color: 'text-warning',
    },
    {
      title: 'Новых клиентов',
      value: data?.newClientsThisMonth || 0,
      icon: Users,
      color: 'text-accent',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Обзор ключевых метрик</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.title}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-background ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Blocked Accounts Alert */}
      {data && data.blockedAccounts > 0 && (
        <Card className="bg-warning/10 border-warning">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-warning" />
            <div>
              <p className="font-medium text-text-primary">
                Заблокировано счетов: {data.blockedAccounts}
              </p>
              <p className="text-sm text-text-secondary">Требуется внимание</p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card title="Последние транзакции" subtitle="Топ-10 недавних операций">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Референс</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>От/Кому</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.recentTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-sm">{tx.referenceNumber}</TableCell>
                <TableCell>{getTransactionTypeLabel(tx.type)}</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(tx.amount, tx.currency)}
                </TableCell>
                <TableCell className="text-sm">
                  {tx.fromAccount && (
                    <div>
                      {tx.fromAccount.client?.firstName} {tx.fromAccount.client?.lastName}
                    </div>
                  )}
                  {tx.toAccount && (
                    <div>
                      {tx.toAccount.client?.firstName} {tx.toAccount.client?.lastName}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                </TableCell>
                <TableCell className="text-sm">{formatDateTime(tx.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDateTime, getStatusColor, getTransactionTypeLabel } from '@/lib/utils';
import { Transaction } from '@/types';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page],
    queryFn: async () => {
      const response = await api.get('/transactions', {
        params: { page, limit: 20 },
      });
      return response.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Транзакции</h1>
        <p className="text-text-secondary mt-1">Журнал всех транзакций</p>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-8 text-text-secondary">Загрузка...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Референс</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>От</TableHead>
                  <TableHead>Кому</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.transactions.map((tx: Transaction) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs">
                      {tx.referenceNumber}
                    </TableCell>
                    <TableCell>{getTransactionTypeLabel(tx.type)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(tx.amount, tx.currency)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {tx.fromAccount ? (
                        <div>
                          <p className="font-mono text-xs">{tx.fromAccount.accountNumber}</p>
                          {tx.fromAccount.client && (
                            <p className="text-xs text-text-secondary">
                              {tx.fromAccount.client.firstName} {tx.fromAccount.client.lastName}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {tx.toAccount ? (
                        <div>
                          <p className="font-mono text-xs">{tx.toAccount.accountNumber}</p>
                          {tx.toAccount.client && (
                            <p className="text-xs text-text-secondary">
                              {tx.toAccount.client.firstName} {tx.toAccount.client.lastName}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-secondary">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {tx.description || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDateTime(tx.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-text-secondary">
                  Показано {data.transactions.length} из {data.pagination.total}
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Назад
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Вперёд
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

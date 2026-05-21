'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate, getStatusColor, getAccountTypeLabel } from '@/lib/utils';
import { Account } from '@/types';
import { Plus } from 'lucide-react';

export default function AccountsPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    type: 'CURRENT',
    currency: 'KGS',
    creditLimit: '',
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['accounts', page],
    queryFn: async () => {
      const response = await api.get('/accounts', {
        params: { page, limit: 10 },
      });
      return response.data.data;
    },
  });

  const { data: clients } = useQuery({
    queryKey: ['clients-all'],
    queryFn: async () => {
      const response = await api.get('/clients', {
        params: { limit: 100 },
      });
      return response.data.data.clients;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        creditLimit: data.creditLimit ? parseFloat(data.creditLimit) : undefined,
      };
      const response = await api.post('/accounts', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setIsModalOpen(false);
      setFormData({ clientId: '', type: 'CURRENT', currency: 'KGS', creditLimit: '' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Счета</h1>
          <p className="text-text-secondary mt-1">Управление банковскими счетами</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Открыть счёт
        </Button>
      </div>

      <Card>
        {isLoading ? (
          <div className="text-center py-8 text-text-secondary">Загрузка...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер счёта</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Валюта</TableHead>
                  <TableHead>Баланс</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Открыт</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.accounts.map((account: Account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono text-sm">
                      {account.accountNumber}
                    </TableCell>
                    <TableCell>
                      {account.client && (
                        <div>
                          <p className="font-medium">
                            {account.client.firstName} {account.client.lastName}
                          </p>
                          <p className="text-xs text-text-secondary">{account.client.email}</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getAccountTypeLabel(account.type)}</TableCell>
                    <TableCell className="font-semibold">{account.currency}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(account.balance, account.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(account.openedAt)}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/accounts/${account.id}`}>
                        <Button size="sm" variant="ghost">
                          Открыть
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {data && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <p className="text-sm text-text-secondary">
                  Показано {data.accounts.length} из {data.pagination.total}
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

      {/* Modal для создания счёта */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Открыть новый счёт"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Клиент
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              required
            >
              <option value="">Выберите клиента</option>
              {clients?.map((client: { id: string; firstName: string; lastName: string }) => (
                <option key={client.id} value={client.id}>
                  {client.lastName} {client.firstName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Тип счёта
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="CURRENT">Текущий</option>
              <option value="SAVINGS">Сберегательный</option>
              <option value="CREDIT">Кредитный</option>
              <option value="DEPOSIT">Депозит</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Валюта
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="KGS">KGS (Сом)</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
            </select>
          </div>

          {formData.type === 'CREDIT' && (
            <Input
              label="Кредитный лимит"
              type="number"
              step="0.01"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              placeholder="10000.00"
            />
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>
              Создать счёт
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

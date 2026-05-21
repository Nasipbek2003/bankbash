'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Client } from '@/types';
import { Search, Plus } from 'lucide-react';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', search, page],
    queryFn: async () => {
      const response = await api.get('/clients', {
        params: { search, page, limit: 10 },
      });
      return response.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Клиенты</h1>
          <p className="text-text-secondary mt-1">Управление клиентами банка</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить клиента
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input
              placeholder="Поиск по имени, email или телефону..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-text-secondary">Загрузка...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Дата рождения</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>KYC</TableHead>
                  <TableHead>Счетов</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.clients.map((client: Client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.lastName} {client.firstName} {client.middleName}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="font-mono text-sm">{client.phone}</TableCell>
                    <TableCell>{formatDate(client.dateOfBirth)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(client.kycStatus)}>
                        {client.kycStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{client._count?.accounts || 0}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/clients/${client.id}`}>
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
                  Показано {data.clients.length} из {data.pagination.total}
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

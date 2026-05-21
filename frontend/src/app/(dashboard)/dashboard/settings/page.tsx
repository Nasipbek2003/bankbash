'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useAuthStore } from '@/store/authStore';
import { Users, Shield, Bell, Edit } from 'lucide-react';

export default function SettingsPage() {
  const { user, setAuth, accessToken, refreshToken } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const { data: users } = useQuery({
    queryKey: ['system-users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data.data;
    },
    enabled: user?.role === 'ADMIN',
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editForm) => {
      const response = await api.put('/auth/profile', data);
      return response.data.data;
    },
    onSuccess: (updatedUser) => {
      setAuth(updatedUser, accessToken || '', refreshToken || '');
      setIsEditModalOpen(false);
      setError('');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message || 'Ошибка обновления профиля');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordForm) => {
      const response = await api.put('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setError('');
      alert('Пароль успешно изменён');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      setError(err.response?.data?.message || 'Ошибка изменения пароля');
    },
  });

  const handleEditProfile = () => {
    setEditForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
    setError('');
    setIsEditModalOpen(true);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    changePasswordMutation.mutate(passwordForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Настройки</h1>
        <p className="text-text-secondary mt-1">Управление системой и пользователями</p>
      </div>

      {/* Профиль текущего пользователя */}
      <Card 
        title="Мой профиль" 
        subtitle="Информация о текущем пользователе"
        action={
          <Button size="sm" variant="secondary" onClick={handleEditProfile}>
            <Edit className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{user?.fullName}</h3>
              <p className="text-text-secondary">{user?.email}</p>
              <Badge className="mt-2">{user?.role}</Badge>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-secondary">Статус</p>
                <p className="text-text-primary font-medium mt-1">
                  {user?.isActive ? 'Активен' : 'Неактивен'}
                </p>
              </div>
              <div>
                <p className="text-text-secondary">Дата регистрации</p>
                <p className="text-text-primary font-medium mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Изменить пароль
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Управление пользователями (только для ADMIN) */}
      {user?.role === 'ADMIN' && (
        <Card
          title="Пользователи системы"
          subtitle="Управление операторами и администраторами"
        >
          {users ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата создания</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: {
                  id: string;
                  fullName: string;
                  email: string;
                  role: string;
                  isActive: boolean;
                  createdAt: string;
                }) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? 'success' : 'danger'}>
                        {u.isActive ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-text-secondary">Загрузка...</div>
          )}
        </Card>
      )}

      {/* Настройки уведомлений */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Bell className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Уведомления</h3>
            <p className="text-sm text-text-secondary">
              Получать уведомления о крупных транзакциях и блокировках счетов
            </p>
          </div>
        </div>
      </Card>

      {/* Безопасность */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <Shield className="w-6 h-6 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Безопасность</h3>
            <p className="text-sm text-text-secondary">
              JWT аутентификация, bcrypt хэширование паролей, аудит всех действий
            </p>
          </div>
        </div>
      </Card>

      {/* Модальное окно редактирования профиля */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Редактировать профиль"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProfileMutation.mutate(editForm);
          }}
          className="space-y-4"
        >
          <Input
            label="ФИО"
            value={editForm.fullName}
            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
            required
          />

          <Input
            label="Email"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            required
          />

          {error && (
            <div className="p-3 bg-danger/10 border border-danger rounded-lg">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1" isLoading={updateProfileMutation.isPending}>
              Сохранить
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </form>
      </Modal>

      {/* Модальное окно изменения пароля */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Изменить пароль"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Текущий пароль"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
            }
            required
          />

          <Input
            label="Новый пароль"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />

          <Input
            label="Подтвердите новый пароль"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
            }
            required
          />

          {error && (
            <div className="p-3 bg-danger/10 border border-danger rounded-lg">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1" isLoading={changePasswordMutation.isPending}>
              Изменить пароль
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPasswordModalOpen(false)}
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

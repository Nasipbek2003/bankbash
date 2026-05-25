'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Users, Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'OPERATOR';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface FormData {
  email: string;
  password: string;
  fullName: string;
  role: 'ADMIN' | 'OPERATOR';
}

export default function OperatorsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    fullName: '',
    role: 'OPERATOR',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось загрузить список пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: '',
        fullName: user.fullName,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        fullName: '',
        role: 'OPERATOR',
      });
    }
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      fullName: '',
      role: 'OPERATOR',
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingUser ? `/users/${editingUser.id}` : '/users';
      const method = editingUser ? 'put' : 'post';

      // Если редактируем и пароль пустой, не отправляем его
      const body = editingUser && !formData.password
        ? { email: formData.email, fullName: formData.fullName, role: formData.role }
        : formData;

      const response = await api[method](url, body);
      setSuccess(response.data.message);
      await fetchUsers();
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    try {
      const response = await api.delete(`/users/${id}`);
      setSuccess(response.data.message || 'Пользователь успешно удален');
      await fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await api.patch(`/users/${id}/toggle-status`);
      setSuccess(response.data.message);
      await fetchUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Произошла ошибка');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Администратор';
      case 'OPERATOR':
        return 'Оператор';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-error/10 text-error';
      case 'OPERATOR':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-surface-secondary text-text-secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Управление операторами</h1>
          <p className="text-text-secondary mt-1">Управление пользователями системы</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить пользователя</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error rounded-lg">
          <p className="text-error font-semibold mb-2">Ошибка загрузки</p>
          <p className="text-error text-sm">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-3 px-4 py-2 bg-error text-white rounded hover:bg-error/90 transition-colors text-sm"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-success/10 border border-success rounded-lg text-success">
          {success}
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text-secondary font-medium">ФИО</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Email</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Роль</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Статус</th>
                <th className="text-left py-3 px-4 text-text-secondary font-medium">Дата создания</th>
                <th className="text-right py-3 px-4 text-text-secondary font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-surface-secondary/50">
                  <td className="py-3 px-4 text-text-primary">{user.fullName}</td>
                  <td className="py-3 px-4 text-text-secondary">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.isActive
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                      }`}
                    >
                      {user.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-secondary">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="p-2 hover:bg-surface-secondary rounded transition-colors"
                        title={user.isActive ? 'Деактивировать' : 'Активировать'}
                      >
                        {user.isActive ? (
                          <PowerOff className="w-4 h-4 text-warning" />
                        ) : (
                          <Power className="w-4 h-4 text-success" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="p-2 hover:bg-surface-secondary rounded transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4 text-accent" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 hover:bg-surface-secondary rounded transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">Пользователи не найдены</p>
            </div>
          )}
        </div>
      </Card>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-error/10 border border-error rounded text-error text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-success/10 border border-success rounded text-success text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  ФИО
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Пароль {editingUser && '(оставьте пустым, чтобы не менять)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                  required={!editingUser}
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Роль
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent"
                  required
                >
                  <option value="OPERATOR">Оператор</option>
                  <option value="ADMIN">Администратор</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                  {editingUser ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-surface-secondary text-text-primary rounded-lg hover:bg-surface-secondary/80 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export function useAuth() {
  const { isAuthenticated, accessToken, setAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated || !accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Проверяем валидность токена
        const response = await api.get('/auth/me');
        const user = response.data.data;
        
        // Обновляем данные пользователя если они изменились
        setAuth(user, accessToken, useAuthStore.getState().refreshToken || '');
      } catch (error) {
        // Если токен невалиден, разлогиниваем
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  return { isAuthenticated, isLoading };
}

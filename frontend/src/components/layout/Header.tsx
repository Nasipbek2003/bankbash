'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuthStore } from '@/store/authStore';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">
          Добро пожаловать, {user?.fullName.split(' ')[0]}!
        </h1>
        <p className="text-sm text-text-secondary">
          {new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-all"
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <NotificationsDropdown />
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  BarChart3,
  Shield,
  Settings2,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Клиенты', href: '/dashboard/clients', icon: Users },
  { name: 'Счета', href: '/dashboard/accounts', icon: CreditCard },
  { name: 'Транзакции', href: '/dashboard/transactions', icon: ArrowLeftRight },
  { name: 'Отчёты', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Аудит', href: '/dashboard/audit', icon: Shield },
  { name: 'Настройки', href: '/dashboard/settings', icon: Settings2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-text-primary">BankDash</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all',
                isActive
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center relative">
            <span className="text-white font-semibold">
              {user?.fullName.charAt(0).toUpperCase()}
            </span>
            {/* Индикатор активной сессии */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-text-secondary">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-danger hover:bg-danger/10 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Выйти</span>
        </button>
      </div>
    </aside>
  );
}

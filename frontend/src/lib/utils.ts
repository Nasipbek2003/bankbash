import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency: string = 'KGS'): string {
  const currencySymbols: Record<string, string> = {
    KGS: 'с',
    USD: '$',
    EUR: '€',
    RUB: '₽',
  };

  const symbol = currencySymbols[currency] || currency;
  
  return `${amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${symbol}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: 'text-success bg-success/10',
    INACTIVE: 'text-text-secondary bg-text-secondary/10',
    BLOCKED: 'text-danger bg-danger/10',
    FROZEN: 'text-warning bg-warning/10',
    CLOSED: 'text-text-secondary bg-text-secondary/10',
    PENDING: 'text-warning bg-warning/10',
    COMPLETED: 'text-success bg-success/10',
    FAILED: 'text-danger bg-danger/10',
    REVERSED: 'text-text-secondary bg-text-secondary/10',
    VERIFIED: 'text-success bg-success/10',
    REJECTED: 'text-danger bg-danger/10',
  };

  return colors[status] || 'text-text-secondary bg-text-secondary/10';
}

export function getTransactionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    DEBIT: 'Списание',
    CREDIT: 'Зачисление',
    TRANSFER: 'Перевод',
    FEE: 'Комиссия',
    REVERSAL: 'Возврат',
  };

  return labels[type] || type;
}

export function getAccountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    CURRENT: 'Текущий',
    SAVINGS: 'Сберегательный',
    CREDIT: 'Кредитный',
    DEPOSIT: 'Депозит',
  };

  return labels[type] || type;
}

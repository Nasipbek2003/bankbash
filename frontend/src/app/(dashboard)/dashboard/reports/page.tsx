'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { BarChart3, FileText, TrendingUp } from 'lucide-react';

type ReportType = 'turnover' | 'clients' | 'accounts' | null;

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Отчёты</h1>
        <p className="text-text-secondary mt-1">Аналитика и отчётность</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => setSelectedReport('turnover')}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Обороты</h3>
              <p className="text-sm text-text-secondary">Отчёт по оборотам за период</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => setSelectedReport('clients')}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <FileText className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Новые клиенты</h3>
              <p className="text-sm text-text-secondary">Отчёт по новым клиентам</p>
            </div>
          </div>
        </Card>

        <Card 
          className="cursor-pointer hover:border-accent transition-colors"
          onClick={() => setSelectedReport('accounts')}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Сводка по счетам</h3>
              <p className="text-sm text-text-secondary">Статистика по типам счетов</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        {!selectedReport ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Выберите тип отчёта
            </h3>
            <p className="text-text-secondary">
              Выберите один из доступных отчётов выше для просмотра детальной информации
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-primary">
                {selectedReport === 'turnover' && 'Отчёт по оборотам'}
                {selectedReport === 'clients' && 'Отчёт по новым клиентам'}
                {selectedReport === 'accounts' && 'Сводка по счетам'}
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Закрыть
              </button>
            </div>

            <div className="border-t border-border pt-6">
              {selectedReport === 'turnover' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Общий оборот</p>
                      <p className="text-2xl font-bold text-text-primary">₽ 12,450,000</p>
                      <p className="text-xs text-success mt-1">+15.3% за месяц</p>
                    </div>
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Входящие</p>
                      <p className="text-2xl font-bold text-success">₽ 8,200,000</p>
                      <p className="text-xs text-text-secondary mt-1">1,234 транзакций</p>
                    </div>
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Исходящие</p>
                      <p className="text-2xl font-bold text-warning">₽ 4,250,000</p>
                      <p className="text-xs text-text-secondary mt-1">892 транзакций</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Данные за период: 1 мая 2026 - 25 мая 2026
                  </p>
                </div>
              )}

              {selectedReport === 'clients' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Новых клиентов</p>
                      <p className="text-2xl font-bold text-text-primary">47</p>
                      <p className="text-xs text-success mt-1">+23% за месяц</p>
                    </div>
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Физ. лица</p>
                      <p className="text-2xl font-bold text-accent">32</p>
                      <p className="text-xs text-text-secondary mt-1">68% от общего</p>
                    </div>
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Юр. лица</p>
                      <p className="text-2xl font-bold text-warning">15</p>
                      <p className="text-xs text-text-secondary mt-1">32% от общего</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Данные за период: 1 мая 2026 - 25 мая 2026
                  </p>
                </div>
              )}

              {selectedReport === 'accounts' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Всего счетов</p>
                      <p className="text-2xl font-bold text-text-primary">1,247</p>
                      <p className="text-xs text-success mt-1">+8.5% за месяц</p>
                    </div>
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Активных</p>
                      <p className="text-2xl font-bold text-success">1,189</p>
                      <p className="text-xs text-text-secondary mt-1">95.3% от общего</p>
                    </div>
                    <div className="p-4 bg-surface-secondary rounded-lg">
                      <p className="text-sm text-text-secondary mb-1">Заблокированных</p>
                      <p className="text-2xl font-bold text-error">58</p>
                      <p className="text-xs text-text-secondary mt-1">4.7% от общего</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-text-primary mb-3">По типам счетов:</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-surface-secondary rounded">
                        <span className="text-text-primary">Текущие счета</span>
                        <span className="font-semibold text-text-primary">687 (55%)</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-surface-secondary rounded">
                        <span className="text-text-primary">Сберегательные</span>
                        <span className="font-semibold text-text-primary">423 (34%)</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-surface-secondary rounded">
                        <span className="text-text-primary">Депозитные</span>
                        <span className="font-semibold text-text-primary">137 (11%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

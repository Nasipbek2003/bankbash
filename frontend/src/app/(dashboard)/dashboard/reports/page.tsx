'use client';

import Card from '@/components/ui/Card';
import { BarChart3, FileText, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Отчёты</h1>
        <p className="text-text-secondary mt-1">Аналитика и отчётность</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:border-accent">
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

        <Card className="cursor-pointer hover:border-accent">
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

        <Card className="cursor-pointer hover:border-accent">
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
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Выберите тип отчёта
          </h3>
          <p className="text-text-secondary">
            Выберите один из доступных отчётов выше для просмотра детальной информации
          </p>
        </div>
      </Card>
    </div>
  );
}

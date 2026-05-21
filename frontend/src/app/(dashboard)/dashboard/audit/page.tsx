'use client';

import Card from '@/components/ui/Card';
import { Shield } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Аудит</h1>
        <p className="text-text-secondary mt-1">Журнал действий пользователей</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Журнал аудита
          </h3>
          <p className="text-text-secondary">
            Здесь будет отображаться история всех действий пользователей системы
          </p>
        </div>
      </Card>
    </div>
  );
}

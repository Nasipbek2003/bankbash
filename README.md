# BankDash — Banking Account Management System

Современное веб-приложение для управления банковскими счетами клиентов.

> 📖 **[Быстрый старт →](./QUICKSTART.md)** | **[Подробная инструкция →](./SETUP.md)**

## Технологический стек

### Frontend
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Zustand (state management)
- TanStack Query (data fetching)
- Recharts (графики)
- lucide-react (иконки)

### Backend
- Node.js 20+
- Express
- TypeScript
- Prisma ORM
- PostgreSQL 15+
- JWT Authentication
- Winston (логирование)

## Быстрый старт

### Предварительные требования
- Node.js 20+
- npm или yarn

### Установка и запуск (рекомендуется)

#### 1. Установка зависимостей

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

#### 2. Настройка базы данных

База данных Neon PostgreSQL уже настроена. Примените миграции и заполните тестовыми данными:

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
```

#### 3. Запуск приложения

**Backend (терминал 1):**
```bash
cd backend
npm run dev
```

**Frontend (терминал 2):**
```bash
cd frontend
npm run dev
```

Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Альтернатива: Docker Compose

```bash
docker-compose up --build
```

**Примечание:** При первом запуске через Docker выполните seed внутри контейнера:
```bash
docker-compose exec backend npm run prisma:seed
```

## Структура проекта

```
bankdash/
├── frontend/          # Next.js приложение
├── backend/           # Express API
├── docker-compose.yml
└── README.md
```

## Функциональность

- ✅ Аутентификация и авторизация (JWT + Refresh Token)
- ✅ Управление клиентами банка
- ✅ Управление счетами (открытие, пополнение, списание, переводы)
- ✅ Журнал транзакций с фильтрацией
- ✅ Дашборд с аналитикой и графиками
- ✅ Отчёты и экспорт данных
- ✅ Аудит действий пользователей
- ✅ Система уведомлений
- ✅ Управление пользователями системы (RBAC)

## Роли пользователей

- **ADMIN** — полный доступ ко всем функциям
- **OPERATOR** — управление клиентами, счетами и транзакциями
- ****VIEWER** — только просмотр данных

## Тестовые пользователи

После запуска seed-скрипта доступны:

```
Email: admin@bankdash.com
Password: admin123
Role: ADMIN

Email: operator@bankdash.com
Password: operator123
Role: OPERATOR
```

## API Документация

API документация доступна по адресу: http://localhost:4000/api-docs (Swagger)

## Лицензия

MIT

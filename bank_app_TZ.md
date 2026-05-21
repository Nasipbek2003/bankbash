# Техническое Задание (ТЗ)
## Веб-приложение для управления счетами клиентов банка

---

## 1. Общая информация

| Параметр | Значение |
|---|---|
| Название проекта | **BankDash** — Banking Account Management System |
| Версия документа | 1.0.0 |
| Стек технологий | React, Next.js 14+, Node.js, PostgreSQL |
| Тип приложения | Full-Stack Web Application (SSR + SPA) |
| Аутентификация | JWT + Refresh Token |

---

## 2. Цель и описание проекта

Разработка современного веб-приложения для управления банковскими счетами клиентов. Система предназначена для банковских операторов и администраторов, обеспечивая полный контроль над счетами, транзакциями и клиентскими данными.

### Ключевые задачи:
- Управление счетами клиентов (создание, редактирование, закрытие)
- Просмотр и фильтрация транзакций
- Управление пользователями и ролями
- Аналитика и отчётность
- Уведомления и аудит действий

---

## 3. Функциональные требования

### 3.1 Аутентификация и авторизация

- Вход по логину и паролю (JWT)
- Роли: `ADMIN`, `OPERATOR`, `VIEWER`
- Refresh Token с автоматическим обновлением сессии
- Защита маршрутов по ролям
- Двухфакторная аутентификация (2FA — опционально)
- Выход из системы с инвалидацией токена

### 3.2 Дашборд (Главная страница)

- Виджеты с ключевыми метриками:
  - Общая сумма активных счетов
  - Количество транзакций за сегодня
  - Новые клиенты за текущий месяц
  - Количество заблокированных счетов
- Графики: динамика транзакций (линейный), распределение по типам счетов (кольцевой)
- Последние транзакции (таблица, топ-10)
- Быстрые действия: создать счёт, найти клиента

### 3.3 Управление клиентами

- Список клиентов с поиском, фильтрацией и пагинацией
- Карточка клиента:
  - Личные данные (ФИО, дата рождения, контакты)
  - Привязанные счета
  - История транзакций
  - Статус KYC
- Создание / редактирование клиента
- Деактивация клиента

### 3.4 Управление счетами

- Список всех счетов с фильтрами (тип, статус, валюта, клиент)
- Детальная страница счёта:
  - Баланс и история балансов
  - Список транзакций по счёту
  - Метаданные счёта (дата открытия, лимиты)
- Действия над счётом:
  - Открытие нового счёта
  - Пополнение / списание (ручная транзакция)
  - Заморозка / разморозка
  - Закрытие счёта
- Типы счетов: `CURRENT`, `SAVINGS`, `CREDIT`, `DEPOSIT`

### 3.5 Транзакции

- Журнал всех транзакций с расширенной фильтрацией:
  - По дате (диапазон)
  - По типу (DEBIT, CREDIT, TRANSFER, FEE)
  - По статусу (PENDING, COMPLETED, FAILED, REVERSED)
  - По сумме (от / до)
  - По счёту / клиенту
- Детальная карточка транзакции
- Отмена / реверс транзакции (с указанием причины)
- Экспорт в CSV / PDF

### 3.6 Отчёты и аналитика

- Отчёт по оборотам за период
- Отчёт по новым клиентам
- Сводка по типам счетов
- Экспорт отчётов в Excel / PDF

### 3.7 Уведомления

- In-app уведомления (колокольчик в шапке)
- Уведомления: крупные транзакции, блокировки, новые клиенты
- Отметка прочитано / архив

### 3.8 Аудит и логи

- Журнал всех действий операторов и администраторов
- Поля: `user`, `action`, `entity`, `entity_id`, `ip`, `timestamp`
- Только просмотр (read-only для операторов)

### 3.9 Настройки

- Управление пользователями системы (только `ADMIN`)
- Назначение ролей
- Настройки уведомлений
- Профиль текущего пользователя

---

## 4. Нефункциональные требования

| Требование | Описание |
|---|---|
| Производительность | Страницы загружаются не более 2 сек (LCP < 2.5s) |
| Адаптивность | Поддержка экранов от 1280px (desktop-first) |
| Безопасность | HTTPS, CORS, Rate Limiting, SQL Injection Protection |
| Доступность | ARIA-атрибуты, навигация с клавиатуры |
| Масштабируемость | Горизонтальное масштабирование backend |
| Логирование | Winston logger, структурированные JSON-логи |

---

## 5. Структура проекта

```
bankdash/
├── frontend/                          # Next.js приложение
│   ├── src/
│   │   ├── app/                       # App Router (Next.js 14)
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx         # Основной layout с сайдбаром
│   │   │   │   ├── page.tsx           # Дашборд
│   │   │   │   ├── clients/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── accounts/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── transactions/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reports/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── audit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   └── api/                   # Next.js API Routes (proxy)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx        # Стабильный левый сайдбар
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Breadcrumbs.tsx
│   │   │   ├── ui/                    # Базовые UI-компоненты
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Skeleton.tsx
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   ├── accounts/
│   │   │   ├── transactions/
│   │   │   └── charts/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useClients.ts
│   │   │   ├── useAccounts.ts
│   │   │   └── useTransactions.ts
│   │   ├── lib/
│   │   │   ├── api.ts                 # Axios instance + interceptors
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   ├── store/                     # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── notificationStore.ts
│   │   └── types/
│   │       ├── client.ts
│   │       ├── account.ts
│   │       └── transaction.ts
│   ├── public/
│   ├── next.config.ts
│   └── package.json
│
├── backend/                           # Node.js / Express API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts            # PostgreSQL connection (pg / Prisma)
│   │   │   └── env.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── clients.controller.ts
│   │   │   ├── accounts.controller.ts
│   │   │   ├── transactions.controller.ts
│   │   │   ├── reports.controller.ts
│   │   │   └── audit.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts     # JWT verify
│   │   │   ├── role.middleware.ts     # RBAC
│   │   │   ├── audit.middleware.ts    # Логирование действий
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── clients.routes.ts
│   │   │   ├── accounts.routes.ts
│   │   │   ├── transactions.routes.ts
│   │   │   ├── reports.routes.ts
│   │   │   └── audit.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── clients.service.ts
│   │   │   ├── accounts.service.ts
│   │   │   └── transactions.service.ts
│   │   ├── prisma/                    # Prisma ORM
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── app.ts
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 6. База данных PostgreSQL

### 6.1 Схема (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Пользователи системы ───────────────────────────────────────────────────

enum SystemUserRole {
  ADMIN
  OPERATOR
  VIEWER
}

model SystemUser {
  id           String         @id @default(uuid())
  email        String         @unique
  passwordHash String
  fullName     String
  role         SystemUserRole @default(OPERATOR)
  isActive     Boolean        @default(true)
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  auditLogs    AuditLog[]
  refreshTokens RefreshToken[]

  @@map("system_users")
}

model RefreshToken {
  id        String     @id @default(uuid())
  token     String     @unique
  userId    String
  user      SystemUser @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime   @default(now())

  @@map("refresh_tokens")
}

// ─── Клиенты банка ──────────────────────────────────────────────────────────

enum ClientStatus {
  ACTIVE
  INACTIVE
  BLOCKED
}

enum KycStatus {
  PENDING
  VERIFIED
  REJECTED
}

model Client {
  id          String       @id @default(uuid())
  firstName   String
  lastName    String
  middleName  String?
  dateOfBirth DateTime     @db.Date
  email       String       @unique
  phone       String       @unique
  address     String?
  status      ClientStatus @default(ACTIVE)
  kycStatus   KycStatus    @default(PENDING)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  accounts    Account[]

  @@map("clients")
}

// ─── Счета ──────────────────────────────────────────────────────────────────

enum AccountType {
  CURRENT
  SAVINGS
  CREDIT
  DEPOSIT
}

enum AccountStatus {
  ACTIVE
  FROZEN
  CLOSED
}

enum Currency {
  USD
  EUR
  RUB
  KGS
}

model Account {
  id            String        @id @default(uuid())
  accountNumber String        @unique
  clientId      String
  client        Client        @relation(fields: [clientId], references: [id])
  type          AccountType
  status        AccountStatus @default(ACTIVE)
  currency      Currency      @default(USD)
  balance       Decimal       @db.Decimal(18, 2) @default(0)
  creditLimit   Decimal?      @db.Decimal(18, 2)
  openedAt      DateTime      @default(now())
  closedAt      DateTime?
  updatedAt     DateTime      @updatedAt

  transactionsFrom Transaction[] @relation("FromAccount")
  transactionsTo   Transaction[] @relation("ToAccount")

  @@index([clientId])
  @@index([accountNumber])
  @@map("accounts")
}

// ─── Транзакции ─────────────────────────────────────────────────────────────

enum TransactionType {
  DEBIT
  CREDIT
  TRANSFER
  FEE
  REVERSAL
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  REVERSED
}

model Transaction {
  id              String            @id @default(uuid())
  referenceNumber String            @unique @default(cuid())
  type            TransactionType
  status          TransactionStatus @default(PENDING)
  amount          Decimal           @db.Decimal(18, 2)
  currency        Currency
  description     String?
  fromAccountId   String?
  fromAccount     Account?          @relation("FromAccount", fields: [fromAccountId], references: [id])
  toAccountId     String?
  toAccount       Account?          @relation("ToAccount", fields: [toAccountId], references: [id])
  reversedById    String?           @unique
  reversedBy      Transaction?      @relation("Reversal", fields: [reversedById], references: [id])
  reversal        Transaction?      @relation("Reversal")
  metadata        Json?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([fromAccountId])
  @@index([toAccountId])
  @@index([createdAt])
  @@index([status])
  @@map("transactions")
}

// ─── Аудит ──────────────────────────────────────────────────────────────────

model AuditLog {
  id         String     @id @default(uuid())
  userId     String
  user       SystemUser @relation(fields: [userId], references: [id])
  action     String
  entity     String
  entityId   String?
  oldValue   Json?
  newValue   Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime   @default(now())

  @@index([userId])
  @@index([entity, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

// ─── Уведомления ────────────────────────────────────────────────────────────

enum NotificationType {
  LARGE_TRANSACTION
  ACCOUNT_BLOCKED
  NEW_CLIENT
  SYSTEM_ALERT
}

model Notification {
  id        String           @id @default(uuid())
  type      NotificationType
  title     String
  message   String
  entityId  String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  @@index([isRead])
  @@map("notifications")
}
```

---

### 6.2 Диаграмма связей (ERD)

```
SystemUser ──< AuditLog
SystemUser ──< RefreshToken

Client ──< Account
Account ──< Transaction (fromAccount)
Account ──< Transaction (toAccount)
Transaction ──o Transaction (reversal)
```

---

## 7. API Endpoints

### Auth
```
POST   /api/auth/login           # Вход
POST   /api/auth/logout          # Выход
POST   /api/auth/refresh         # Обновление токена
GET    /api/auth/me              # Текущий пользователь
```

### Clients
```
GET    /api/clients              # Список (query: search, status, page, limit)
POST   /api/clients              # Создание
GET    /api/clients/:id          # Детали
PUT    /api/clients/:id          # Обновление
PATCH  /api/clients/:id/status   # Смена статуса
```

### Accounts
```
GET    /api/accounts             # Список (query: clientId, type, status, currency)
POST   /api/accounts             # Открытие счёта
GET    /api/accounts/:id         # Детали счёта
PATCH  /api/accounts/:id/status  # Заморозка / закрытие
POST   /api/accounts/:id/deposit     # Пополнение
POST   /api/accounts/:id/withdraw    # Списание
POST   /api/accounts/transfer        # Перевод между счетами
```

### Transactions
```
GET    /api/transactions         # Журнал (query: accountId, type, status, dateFrom, dateTo, amountMin, amountMax)
GET    /api/transactions/:id     # Детали
POST   /api/transactions/:id/reverse  # Реверс
GET    /api/transactions/export  # Экспорт CSV
```

### Reports
```
GET    /api/reports/turnover     # Обороты за период
GET    /api/reports/clients      # Новые клиенты
GET    /api/reports/accounts     # Сводка по счетам
```

### Audit
```
GET    /api/audit                # Журнал аудита
```

### System Users
```
GET    /api/users                # Список (только ADMIN)
POST   /api/users                # Создание
PUT    /api/users/:id            # Обновление
PATCH  /api/users/:id/role       # Смена роли
```

---

## 8. Дизайн и UI/UX

### 8.1 Общая концепция

**Стиль**: Современный финансовый дашборд в духе Figma / Linear / Vercel.
Тёмная тема по умолчанию с опцией светлой. Акцентный цвет — синий (`#2563EB`).

### 8.2 Цветовая палитра

| Назначение | Dark | Light |
|---|---|---|
| Background | `#0F1117` | `#F8FAFC` |
| Surface | `#161B27` | `#FFFFFF` |
| Border | `#1E2535` | `#E2E8F0` |
| Text Primary | `#F1F5F9` | `#0F172A` |
| Text Secondary | `#64748B` | `#64748B` |
| Accent (Blue) | `#2563EB` | `#2563EB` |
| Success | `#10B981` | `#059669` |
| Warning | `#F59E0B` | `#D97706` |
| Danger | `#EF4444` | `#DC2626` |

### 8.3 Типографика

```
Шрифты:
- Заголовки: "Geist" (Vercel)
- Текст: "Inter" (Google Fonts)
- Код / числа: "JetBrains Mono"
```

### 8.4 Иконки

**Библиотека**: `lucide-react` — современные, минималистичные SVG-иконки.
Без эмодзи, только иконки из Lucide.

Иконки для навигации:
```
Dashboard     → LayoutDashboard
Clients       → Users
Accounts      → CreditCard
Transactions  → ArrowLeftRight
Reports       → BarChart3
Audit         → Shield
Settings      → Settings2
Logout        → LogOut
Notifications → Bell
```

### 8.5 Сайдбар (Левая навигация)

```
┌─────────────────────────────┐
│  🏦 BankDash                │  ← Логотип
├─────────────────────────────┤
│  ○ Dashboard                │
│  ○ Clients                  │
│  ○ Accounts                 │
│  ○ Transactions             │
│  ○ Reports                  │
│  ○ Audit                    │
│  ○ Settings                 │
├─────────────────────────────┤
│  [Avatar] Иван И.           │  ← Профиль
│           Admin             │
└─────────────────────────────┘
```

- **Ширина**: 240px (фиксированная), 64px (свёрнутый режим)
- **Позиция**: `fixed left-0 top-0 h-screen` — стабильный при навигации
- **Анимация**: плавное переключение активного пункта с `transition: all 200ms ease`
- **Активный пункт**: синяя полоса слева + синий фон `bg-blue-600/10`

### 8.6 Анимации

```css
/* Плавные переходы страниц */
transition: opacity 150ms ease, transform 150ms ease;

/* Hover эффекты на кнопках */
transition: background-color 150ms ease, box-shadow 150ms ease;

/* Skeleton загрузка таблиц */
animation: pulse 1.5s ease-in-out infinite;

/* Появление модальных окон */
animation: fadeIn 200ms ease, scaleIn 200ms ease;

/* Fade In для карточек на дашборде */
animation: slideUp 300ms ease forwards;
animation-delay: calc(var(--index) * 50ms);
```

### 8.7 Layout

```
┌──────────────────────────────────────────────────────────┐
│ SIDEBAR (240px fixed)  │  HEADER (fixed top)             │
│                        │─────────────────────────────────│
│  [Nav Items]           │  MAIN CONTENT (scrollable)      │
│                        │                                 │
│                        │  ┌───────┐ ┌───────┐ ┌───────┐ │
│                        │  │ Card  │ │ Card  │ │ Card  │ │
│                        │  └───────┘ └───────┘ └───────┘ │
│                        │                                 │
│  ────────────────       │  ┌──────────────────────────┐  │
│  [User Profile]        │  │       Table / Chart       │  │
│                        │  └──────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 9. Технический стек

### Frontend
| Библиотека | Версия | Назначение |
|---|---|---|
| Next.js | 14+ | SSR Framework, App Router |
| React | 18+ | UI библиотека |
| TypeScript | 5+ | Типизация |
| Tailwind CSS | 3+ | Стилизация |
| Zustand | 4+ | Глобальное состояние |
| TanStack Query | 5+ | Data fetching, кэш |
| Axios | 1+ | HTTP client |
| lucide-react | — | Иконки |
| Recharts | 2+ | Графики |
| date-fns | 3+ | Работа с датами |
| react-hook-form | 7+ | Формы |
| zod | 3+ | Валидация схем |

### Backend
| Библиотека | Версия | Назначение |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 4+ | HTTP Framework |
| TypeScript | 5+ | Типизация |
| Prisma | 5+ | ORM для PostgreSQL |
| PostgreSQL | 15+ | База данных |
| jsonwebtoken | — | JWT |
| bcryptjs | — | Хэширование паролей |
| winston | — | Логирование |
| zod | 3+ | Валидация запросов |
| cors | — | CORS |
| helmet | — | Безопасность HTTP |
| express-rate-limit | — | Rate limiting |

### DevOps
| Инструмент | Назначение |
|---|---|
| Docker + Docker Compose | Контейнеризация |
| PostgreSQL (Docker) | БД в контейнере |
| Redis (опционально) | Кэш / сессии |
| GitHub Actions | CI/CD |

---

## 10. Безопасность

- **Пароли**: bcrypt с salt rounds = 12
- **JWT**: Access Token (15 мин), Refresh Token (7 дней), хранение в httpOnly Cookie
- **CORS**: whitelist разрешённых origins
- **Helmet.js**: защита HTTP-заголовков
- **Rate Limiting**: 100 запросов / минуту на IP
- **SQL Injection**: Prisma parameterized queries
- **XSS**: санитизация входных данных
- **Audit**: все мутации логируются в `audit_logs`

---

## 11. Переменные окружения

### Backend `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bankdash"
JWT_SECRET="your-very-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 12. Docker Compose

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: bankdash
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/bankdash
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000/api
    depends_on:
      - backend

volumes:
  pgdata:
```

---

## 13. Этапы разработки

### Спринт 1 — Основа (1-2 неделя)
- [ ] Инициализация проектов (frontend / backend)
- [ ] Настройка PostgreSQL + Prisma + миграции
- [ ] Аутентификация (login, JWT, refresh token)
- [ ] Layout: сайдбар, хедер, роутинг

### Спринт 2 — Ядро (3-4 неделя)
- [ ] CRUD клиентов
- [ ] CRUD счетов
- [ ] Базовые транзакции (пополнение, списание, перевод)

### Спринт 3 — Дашборд и таблицы (5 неделя)
- [ ] Дашборд с виджетами и графиками
- [ ] Журнал транзакций с фильтрацией
- [ ] Пагинация, поиск

### Спринт 4 — Расширение (6 неделя)
- [ ] Отчёты и экспорт
- [ ] Аудит
- [ ] Уведомления
- [ ] Управление пользователями системы

### Спринт 5 — Финал (7 неделя)
- [ ] Тестирование (unit + e2e)
- [ ] Docker Compose
- [ ] Документация API (Swagger)
- [ ] Code review + деплой

---

## 14. Примечания и ограничения

- Все денежные суммы хранятся в `DECIMAL(18, 2)` — без потери точности
- Транзакции выполняются в PostgreSQL-транзакциях (`BEGIN / COMMIT / ROLLBACK`)
- Закрытый счёт не может участвовать в новых транзакциях
- Удаление клиентов — мягкое (soft delete через статус `INACTIVE`)
- Все временные метки хранятся в UTC

---

*Документ подготовлен в соответствии с требованиями к разработке банковского веб-приложения.*
*Версия 1.0.0 — подлежит обновлению по мере уточнения требований.*

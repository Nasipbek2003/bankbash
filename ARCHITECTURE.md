# 🏗️ Архитектура BankDash

## Общая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                    (Next.js 14 + React)                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Store     │     │
│  │  (App Router)│  │   (UI/UX)    │  │  (Zustand)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         TanStack Query (Data Fetching)               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ (JWT Auth)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│                   (Node.js + Express)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Controllers │  │   Services   │  │  Middleware  │     │
│  │   (Routes)   │  │  (Business)  │  │ (Auth/Audit) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Prisma ORM                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Neon PostgreSQL                          │
│                  (Serverless Database)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Технологии
- **Next.js 14** - React framework с App Router
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Zustand** - State management
- **TanStack Query** - Data fetching и кэширование
- **Axios** - HTTP клиент
- **Lucide React** - Иконки

### Структура папок

```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Группа маршрутов для аутентификации
│   │   └── login/         # Страница входа
│   ├── (dashboard)/       # Группа маршрутов для дашборда
│   │   ├── layout.tsx     # Layout с Sidebar + Header
│   │   └── dashboard/     # Страницы дашборда
│   ├── layout.tsx         # Root layout
│   ├── providers.tsx      # React Query Provider
│   └── globals.css        # Глобальные стили
│
├── components/
│   ├── layout/            # Layout компоненты
│   │   ├── Sidebar.tsx    # Боковая навигация
│   │   └── Header.tsx     # Шапка
│   └── ui/                # UI компоненты
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       ├── Table.tsx
│       └── Badge.tsx
│
├── lib/
│   ├── api.ts             # Axios instance + interceptors
│   └── utils.ts           # Утилиты (форматирование, цвета)
│
├── store/
│   └── authStore.ts       # Zustand store для аутентификации
│
└── types/
    └── index.ts           # TypeScript типы
```

### Паттерны

#### 1. Route Groups
Используются для организации маршрутов без влияния на URL:
- `(auth)` - страницы аутентификации
- `(dashboard)` - защищённые страницы

#### 2. Server Components vs Client Components
- Server Components по умолчанию (статика)
- Client Components с `'use client'` (интерактивность)

#### 3. Data Fetching
```typescript
// TanStack Query для кэширования и автообновления
const { data, isLoading } = useQuery({
  queryKey: ['clients', page],
  queryFn: async () => {
    const response = await api.get('/clients', { params: { page } });
    return response.data.data;
  },
});
```

#### 4. Authentication Flow
```
1. Login → POST /api/auth/login
2. Store tokens in Zustand (persisted to localStorage)
3. Axios interceptor adds Bearer token to requests
4. On 401 → Auto refresh token
5. On refresh fail → Logout + redirect to /login
```

---

## Backend Architecture

### Технологии
- **Node.js 20** - Runtime
- **Express** - HTTP framework
- **TypeScript** - Типизация
- **Prisma** - ORM
- **PostgreSQL** - База данных
- **JWT** - Аутентификация
- **bcrypt** - Хэширование паролей
- **Winston** - Логирование
- **Zod** - Валидация

### Структура папок

```
backend/src/
├── config/
│   ├── database.ts        # Prisma client
│   ├── env.ts             # Валидация env переменных
│   └── logger.ts          # Winston logger
│
├── controllers/           # HTTP handlers
│   ├── auth.controller.ts
│   ├── clients.controller.ts
│   ├── accounts.controller.ts
│   ├── transactions.controller.ts
│   └── reports.controller.ts
│
├── services/              # Бизнес-логика
│   ├── auth.service.ts
│   ├── clients.service.ts
│   ├── accounts.service.ts
│   ├── transactions.service.ts
│   └── reports.service.ts
│
├── routes/                # Express routes
│   ├── auth.routes.ts
│   ├── clients.routes.ts
│   ├── accounts.routes.ts
│   ├── transactions.routes.ts
│   └── reports.routes.ts
│
├── middleware/
│   ├── auth.middleware.ts      # JWT verification
│   ├── role.middleware.ts      # RBAC
│   ├── audit.middleware.ts     # Audit logging
│   ├── validate.ts             # Zod validation
│   └── errorHandler.ts         # Error handling
│
├── utils/
│   ├── jwt.ts             # JWT helpers
│   └── errors.ts          # Custom error classes
│
└── app.ts                 # Express app entry point
```

### Архитектурные слои

#### 1. Routes Layer
Определяет HTTP endpoints и применяет middleware:
```typescript
router.post(
  '/',
  authenticate,                    // Auth middleware
  requireRole('ADMIN', 'OPERATOR'), // RBAC middleware
  auditLog('CREATE', 'CLIENT'),    // Audit middleware
  clientsController.createClient   // Controller
);
```

#### 2. Controllers Layer
Обрабатывает HTTP запросы/ответы:
```typescript
async createClient(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const client = await clientsService.createClient(req.body);
    res.status(201).json({ status: 'success', data: client });
  } catch (error) {
    next(error); // Передаёт в error handler
  }
}
```

#### 3. Services Layer
Содержит бизнес-логику:
```typescript
async createClient(data: CreateClientDto) {
  // Валидация
  const existing = await prisma.client.findFirst({
    where: { OR: [{ email: data.email }, { phone: data.phone }] }
  });
  
  if (existing) {
    throw new ConflictError('Client already exists');
  }
  
  // Создание
  return await prisma.client.create({ data });
}
```

#### 4. Database Layer (Prisma)
ORM для работы с PostgreSQL:
```typescript
await prisma.$transaction(async (tx) => {
  // Атомарные операции
  await tx.account.update({ ... });
  await tx.transaction.create({ ... });
});
```

### Middleware Pipeline

```
Request
  ↓
[CORS] → [Helmet] → [Rate Limit] → [Body Parser]
  ↓
[Logger] → [Authenticate] → [Role Check] → [Audit]
  ↓
Controller → Service → Database
  ↓
[Error Handler]
  ↓
Response
```

---

## Security Architecture

### 1. Authentication
- **JWT Access Token** (15 min) - для API запросов
- **JWT Refresh Token** (7 days) - для обновления access token
- Refresh tokens хранятся в БД для возможности отзыва

### 2. Authorization (RBAC)
```
ADMIN    → Полный доступ
OPERATOR → Создание/редактирование клиентов, счетов, транзакций
VIEWER   → Только чтение
```

### 3. Password Security
- bcrypt с salt rounds = 12
- Минимум 6 символов (можно усилить)

### 4. API Security
- **Helmet.js** - защита HTTP заголовков
- **CORS** - whitelist разрешённых origins
- **Rate Limiting** - 100 req/min на IP
- **SQL Injection** - защита через Prisma
- **XSS** - санитизация входных данных

### 5. Audit Trail
Все мутации логируются в `audit_logs`:
- Кто выполнил действие
- Что было изменено
- Когда
- Откуда (IP, User Agent)

---

## Data Flow Examples

### Пример 1: Создание клиента

```
Frontend                Backend                  Database
   │                       │                        │
   │  POST /api/clients    │                        │
   ├──────────────────────>│                        │
   │                       │                        │
   │                       │ authenticate()         │
   │                       │ requireRole()          │
   │                       │ auditLog()             │
   │                       │                        │
   │                       │ createClient()         │
   │                       ├───────────────────────>│
   │                       │                        │
   │                       │ INSERT INTO clients    │
   │                       │<───────────────────────│
   │                       │                        │
   │                       │ INSERT INTO audit_logs │
   │                       ├───────────────────────>│
   │                       │<───────────────────────│
   │                       │                        │
   │  { status, data }     │                        │
   │<──────────────────────│                        │
   │                       │                        │
```

### Пример 2: Перевод между счетами

```
Frontend                Backend                  Database
   │                       │                        │
   │  POST /accounts/      │                        │
   │       transfer        │                        │
   ├──────────────────────>│                        │
   │                       │                        │
   │                       │ BEGIN TRANSACTION      │
   │                       ├───────────────────────>│
   │                       │                        │
   │                       │ 1. Проверка счетов     │
   │                       │ 2. Проверка баланса    │
   │                       │ 3. Создание транзакции │
   │                       │ 4. Обновление балансов │
   │                       │                        │
   │                       │ COMMIT                 │
   │                       │<───────────────────────│
   │                       │                        │
   │  { transaction }      │                        │
   │<──────────────────────│                        │
   │                       │                        │
```

---

## Scalability Considerations

### Horizontal Scaling
- Backend - stateless, можно запустить несколько инстансов
- Load balancer перед backend
- Neon PostgreSQL - автоматическое масштабирование

### Caching Strategy
- Frontend: TanStack Query кэширует данные
- Backend: можно добавить Redis для сессий/кэша

### Database Optimization
- Индексы на часто используемых полях
- Connection pooling через Neon
- Pagination для больших списков

---

## Monitoring & Logging

### Backend Logging (Winston)
```typescript
logger.info('User logged in', { userId, ip });
logger.error('Transaction failed', { error, transactionId });
```

### Database Monitoring
- Neon Dashboard - метрики производительности
- Prisma Studio - просмотр данных

### Frontend Error Tracking
- Console errors в development
- Можно добавить Sentry для production

---

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              Load Balancer                  │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────┐       ┌───────────────┐
│   Frontend    │       │   Frontend    │
│  (Vercel/     │       │  (Vercel/     │
│   Netlify)    │       │   Netlify)    │
└───────────────┘       └───────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │   Backend API         │
        │  (Railway/Render/     │
        │   Fly.io)             │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Neon PostgreSQL     │
        │   (Serverless)        │
        └───────────────────────┘
```

---

## Future Enhancements

### Backend
- [ ] WebSocket для real-time уведомлений
- [ ] Redis для кэширования
- [ ] GraphQL API
- [ ] Microservices архитектура
- [ ] Event sourcing для транзакций

### Frontend
- [ ] PWA поддержка
- [ ] Offline mode
- [ ] Advanced charts (D3.js)
- [ ] Export в Excel/PDF
- [ ] Drag & drop file upload

### Infrastructure
- [ ] CI/CD pipeline
- [ ] Automated testing
- [ ] Performance monitoring
- [ ] Backup automation
- [ ] Multi-region deployment

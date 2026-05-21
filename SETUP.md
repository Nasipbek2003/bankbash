# Инструкция по запуску BankDash

## Предварительные требования
- Node.js 20+
- npm или yarn

## Быстрый старт (без Docker)

### 1. Установка зависимостей

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Настройка базы данных

База данных Neon PostgreSQL уже настроена в `.env` файлах.

#### Применение миграций
```bash
cd backend
npx prisma migrate deploy
```

#### Генерация Prisma Client
```bash
npx prisma generate
```

#### Заполнение тестовыми данными
```bash
npm run prisma:seed
```

### 3. Запуск приложения

#### Запуск Backend (в одном терминале)
```bash
cd backend
npm run dev
```
Backend будет доступен на http://localhost:4000

#### Запуск Frontend (в другом терминале)
```bash
cd frontend
npm run dev
```
Frontend будет доступен на http://localhost:3000

## Запуск через Docker Compose

```bash
docker-compose up --build
```

После запуска:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Тестовые пользователи

После выполнения seed-скрипта доступны следующие пользователи:

```
Email: admin@bankdash.com
Password: admin123
Role: ADMIN

Email: operator@bankdash.com
Password: operator123
Role: OPERATOR

Email: viewer@bankdash.com
Password: viewer123
Role: VIEWER
```

## Полезные команды

### Backend

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск production
npm start

# Prisma Studio (GUI для БД)
npm run prisma:studio

# Создание новой миграции
npx prisma migrate dev --name migration_name
```

### Frontend

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Запуск production
npm start

# Линтинг
npm run lint
```

## Структура проекта

```
bankdash/
├── backend/              # Express API
│   ├── src/
│   │   ├── config/      # Конфигурация (БД, env, logger)
│   │   ├── controllers/ # Контроллеры
│   │   ├── services/    # Бизнес-логика
│   │   ├── routes/      # Маршруты API
│   │   ├── middleware/  # Middleware (auth, audit, errors)
│   │   └── utils/       # Утилиты
│   ├── prisma/          # Prisma схема и миграции
│   └── package.json
│
├── frontend/            # Next.js приложение
│   ├── src/
│   │   ├── app/        # App Router страницы
│   │   ├── components/ # React компоненты
│   │   ├── lib/        # Утилиты и API клиент
│   │   ├── store/      # Zustand stores
│   │   └── types/      # TypeScript типы
│   └── package.json
│
└── docker-compose.yml
```

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `POST /api/auth/refresh` - Обновление токена
- `GET /api/auth/me` - Текущий пользователь

### Клиенты
- `GET /api/clients` - Список клиентов
- `POST /api/clients` - Создание клиента
- `GET /api/clients/:id` - Детали клиента
- `PUT /api/clients/:id` - Обновление клиента
- `PATCH /api/clients/:id/status` - Смена статуса

### Счета
- `GET /api/accounts` - Список счетов
- `POST /api/accounts` - Открытие счёта
- `GET /api/accounts/:id` - Детали счёта
- `PATCH /api/accounts/:id/status` - Смена статуса
- `POST /api/accounts/:id/deposit` - Пополнение
- `POST /api/accounts/:id/withdraw` - Списание
- `POST /api/accounts/transfer` - Перевод

### Транзакции
- `GET /api/transactions` - Журнал транзакций
- `GET /api/transactions/:id` - Детали транзакции
- `POST /api/transactions/:id/reverse` - Реверс транзакции

### Отчёты
- `GET /api/reports/dashboard` - Статистика для дашборда
- `GET /api/reports/turnover` - Отчёт по оборотам
- `GET /api/reports/clients` - Отчёт по клиентам
- `GET /api/reports/accounts` - Сводка по счетам

## Troubleshooting

### Ошибка подключения к БД
Убедитесь, что DATABASE_URL в `backend/.env` корректен и база данных доступна.

### Ошибка "Prisma Client not generated"
Выполните:
```bash
cd backend
npx prisma generate
```

### Порты заняты
Если порты 3000 или 4000 заняты, измените их в:
- Backend: `backend/.env` (PORT)
- Frontend: при запуске Next.js автоматически предложит другой порт

### Проблемы с Docker
Очистите Docker кэш:
```bash
docker-compose down -v
docker-compose up --build
```

## Поддержка

Для вопросов и проблем создайте issue в репозитории проекта.

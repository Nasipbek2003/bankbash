# 🗄️ База данных BankDash

## Подключение

Приложение использует **Neon PostgreSQL** - serverless PostgreSQL база данных.

### Connection String
```
postgresql://neondb_owner:npg_iAjfaLQ9UJx5@ep-cool-forest-aq67bzii-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Строка подключения уже настроена в `backend/.env`

---

## Схема базы данных

### Таблицы

#### 1. **system_users** - Пользователи системы
Операторы и администраторы банка
- `id` - UUID
- `email` - Email (уникальный)
- `passwordHash` - Хэш пароля (bcrypt)
- `fullName` - ФИО
- `role` - Роль (ADMIN, OPERATOR, VIEWER)
- `isActive` - Активен ли пользователь

#### 2. **refresh_tokens** - Refresh токены
Для обновления JWT токенов
- `id` - UUID
- `token` - Refresh token (уникальный)
- `userId` - Связь с system_users
- `expiresAt` - Дата истечения

#### 3. **clients** - Клиенты банка
- `id` - UUID
- `firstName`, `lastName`, `middleName` - ФИО
- `dateOfBirth` - Дата рождения
- `email` - Email (уникальный)
- `phone` - Телефон (уникальный)
- `address` - Адрес
- `status` - Статус (ACTIVE, INACTIVE, BLOCKED)
- `kycStatus` - Статус верификации (PENDING, VERIFIED, REJECTED)

#### 4. **accounts** - Банковские счета
- `id` - UUID
- `accountNumber` - Номер счёта (уникальный)
- `clientId` - Связь с clients
- `type` - Тип (CURRENT, SAVINGS, CREDIT, DEPOSIT)
- `status` - Статус (ACTIVE, FROZEN, CLOSED)
- `currency` - Валюта (USD, EUR, RUB, KGS)
- `balance` - Баланс (DECIMAL 18,2)
- `creditLimit` - Кредитный лимит
- `openedAt` - Дата открытия
- `closedAt` - Дата закрытия

#### 5. **transactions** - Транзакции
- `id` - UUID
- `referenceNumber` - Референс номер (уникальный)
- `type` - Тип (DEBIT, CREDIT, TRANSFER, FEE, REVERSAL)
- `status` - Статус (PENDING, COMPLETED, FAILED, REVERSED)
- `amount` - Сумма (DECIMAL 18,2)
- `currency` - Валюта
- `description` - Описание
- `fromAccountId` - Счёт списания
- `toAccountId` - Счёт зачисления
- `reversedById` - Связь с реверсивной транзакцией
- `metadata` - JSON метаданные

#### 6. **audit_logs** - Журнал аудита
- `id` - UUID
- `userId` - Пользователь, выполнивший действие
- `action` - Действие (CREATE, UPDATE, DELETE, etc.)
- `entity` - Сущность (CLIENT, ACCOUNT, TRANSACTION)
- `entityId` - ID сущности
- `oldValue` - Старое значение (JSON)
- `newValue` - Новое значение (JSON)
- `ipAddress` - IP адрес
- `userAgent` - User Agent
- `createdAt` - Время действия

#### 7. **notifications** - Уведомления
- `id` - UUID
- `type` - Тип (LARGE_TRANSACTION, ACCOUNT_BLOCKED, NEW_CLIENT, SYSTEM_ALERT)
- `title` - Заголовок
- `message` - Сообщение
- `entityId` - Связанная сущность
- `isRead` - Прочитано ли
- `createdAt` - Время создания

---

## Связи между таблицами

```
SystemUser ──< RefreshToken
SystemUser ──< AuditLog

Client ──< Account

Account ──< Transaction (fromAccount)
Account ──< Transaction (toAccount)

Transaction ──o Transaction (reversal - самосвязь)
```

---

## Индексы

Для оптимизации производительности созданы индексы на:
- `accounts.clientId`
- `accounts.accountNumber`
- `transactions.fromAccountId`
- `transactions.toAccountId`
- `transactions.createdAt`
- `transactions.status`
- `audit_logs.userId`
- `audit_logs.entity + entityId`
- `audit_logs.createdAt`
- `notifications.isRead`

---

## Миграции

### Применение миграций
```bash
cd backend
npx prisma migrate deploy
```

### Создание новой миграции
```bash
npx prisma migrate dev --name migration_name
```

### Сброс базы данных (ОСТОРОЖНО!)
```bash
npx prisma migrate reset
```

---

## Seed данные

### Запуск seed
```bash
cd backend
npm run prisma:seed
```

### Что создаётся:

**Пользователи системы:**
- admin@bankdash.com (ADMIN)
- operator@bankdash.com (OPERATOR)
- viewer@bankdash.com (VIEWER)

**Клиенты:** 3 тестовых клиента

**Счета:** 5 счетов разных типов и валют

**Транзакции:** 8 транзакций разных типов

**Уведомления:** 3 уведомления

---

## Prisma Studio

Графический интерфейс для работы с БД:

```bash
cd backend
npx prisma studio
```

Откроется на http://localhost:5555

---

## Безопасность

✅ **Пароли** - хэшируются с bcrypt (salt rounds = 12)  
✅ **SQL Injection** - защита через Prisma parameterized queries  
✅ **Транзакции** - используются PostgreSQL транзакции для целостности данных  
✅ **SSL** - подключение к Neon через SSL  

---

## Backup

Для создания backup базы данных используйте Neon Dashboard или pg_dump:

```bash
pg_dump "postgresql://neondb_owner:npg_iAjfaLQ9UJx5@ep-cool-forest-aq67bzii-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require" > backup.sql
```

---

## Мониторинг

Neon предоставляет встроенный мониторинг:
- Количество подключений
- Размер базы данных
- Производительность запросов

Доступно в Neon Dashboard: https://console.neon.tech

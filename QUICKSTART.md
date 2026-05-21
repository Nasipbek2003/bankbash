# 🚀 Быстрый старт BankDash

## Самый простой способ запуска

### Windows
Дважды кликните на файл `start.bat` или выполните в терминале:
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

Скрипт автоматически:
1. ✅ Установит все зависимости
2. ✅ Настроит базу данных
3. ✅ Заполнит тестовыми данными
4. ✅ Запустит backend и frontend

---

## Ручной запуск

### Шаг 1: Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

### Шаг 2: Frontend (в новом терминале)

```bash
cd frontend
npm install
npm run dev
```

---

## После запуска

Откройте браузер:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000

### Войдите в систему:

**Администратор:**
- Email: `admin@bankdash.com`
- Пароль: `admin123`

**Оператор:**
- Email: `operator@bankdash.com`
- Пароль: `operator123`

**Просмотр:**
- Email: `viewer@bankdash.com`
- Пароль: `viewer123`

---

## Что доступно

✅ **Dashboard** - статистика и метрики  
✅ **Клиенты** - управление клиентами банка  
✅ **Счета** - управление банковскими счетами  
✅ **Транзакции** - журнал всех операций  
✅ **Отчёты** - аналитика и отчётность  
✅ **Аудит** - журнал действий пользователей  
✅ **Настройки** - управление системой  

---

## Полезные команды

### Prisma Studio (GUI для БД)
```bash
cd backend
npx prisma studio
```
Откроется на http://localhost:5555

### Просмотр логов
Backend логи отображаются в терминале с цветной подсветкой

### Остановка серверов
Нажмите `Ctrl+C` в терминалах или закройте окна

---

## Troubleshooting

### Порт занят
Если порт 3000 или 4000 занят:
- Next.js автоматически предложит другой порт
- Для backend измените `PORT` в `backend/.env`

### Ошибка подключения к БД
Проверьте `DATABASE_URL` в `backend/.env`

### Prisma ошибки
```bash
cd backend
npx prisma generate
npx prisma migrate reset
npm run prisma:seed
```

---

## Дополнительная информация

Подробная документация: [SETUP.md](./SETUP.md)  
Техническое задание: [bank_app_TZ.md](./bank_app_TZ.md)

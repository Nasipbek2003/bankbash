@echo off
echo 🚀 Запуск BankDash...
echo.

REM Проверка Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js не установлен. Установите Node.js 20+ и попробуйте снова.
    pause
    exit /b 1
)

echo ✅ Node.js обнаружен
echo.

REM Backend
echo 📦 Установка зависимостей backend...
cd backend
call npm install

echo.
echo 🗄️  Настройка базы данных...
call npx prisma generate
call npx prisma migrate deploy

echo.
echo 🌱 Заполнение тестовыми данными...
call npm run prisma:seed

echo.
echo 🚀 Запуск backend сервера...
start "BankDash Backend" cmd /k npm run dev

cd ..

REM Frontend
echo.
echo 📦 Установка зависимостей frontend...
cd frontend
call npm install

echo.
echo 🚀 Запуск frontend сервера...
start "BankDash Frontend" cmd /k npm run dev

cd ..

echo.
echo ✅ Приложение запущено!
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:4000
echo.
echo 🔑 Тестовые пользователи:
echo    admin@bankdash.com / admin123
echo    operator@bankdash.com / operator123
echo.
echo Закройте окна терминалов для остановки серверов.
echo.
pause

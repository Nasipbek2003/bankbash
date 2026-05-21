#!/bin/bash

echo "🚀 Запуск BankDash..."
echo ""

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 20+ и попробуйте снова."
    exit 1
fi

echo "✅ Node.js $(node -v) обнаружен"
echo ""

# Backend
echo "📦 Установка зависимостей backend..."
cd backend
npm install

echo ""
echo "🗄️  Настройка базы данных..."
npx prisma generate
npx prisma migrate deploy

echo ""
echo "🌱 Заполнение тестовыми данными..."
npm run prisma:seed

echo ""
echo "🚀 Запуск backend сервера..."
npm run dev &
BACKEND_PID=$!

cd ..

# Frontend
echo ""
echo "📦 Установка зависимостей frontend..."
cd frontend
npm install

echo ""
echo "🚀 Запуск frontend сервера..."
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ Приложение запущено!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:4000"
echo ""
echo "🔑 Тестовые пользователи:"
echo "   admin@bankdash.com / admin123"
echo "   operator@bankdash.com / operator123"
echo ""
echo "Нажмите Ctrl+C для остановки..."

# Ожидание завершения
wait $BACKEND_PID $FRONTEND_PID

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создание системных пользователей
  const adminPassword = await bcrypt.hash('admin123', 12);
  const operatorPassword = await bcrypt.hash('operator123', 12);

  const admin = await prisma.systemUser.upsert({
    where: { email: 'admin@bankdash.com' },
    update: {
      passwordHash: adminPassword,
      fullName: 'Иван Администратов',
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: 'admin@bankdash.com',
      passwordHash: adminPassword,
      fullName: 'Иван Администратов',
      role: 'ADMIN',
    },
  });

  const operator = await prisma.systemUser.upsert({
    where: { email: 'operator@bankdash.com' },
    update: {
      passwordHash: operatorPassword,
      fullName: 'Мария Операторова',
      role: 'OPERATOR',
      isActive: true,
    },
    create: {
      email: 'operator@bankdash.com',
      passwordHash: operatorPassword,
      fullName: 'Мария Операторова',
      role: 'OPERATOR',
    },
  });

  console.log('✅ System users created');

  // Создание тестовых клиентов
  const client1 = await prisma.client.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      firstName: 'Джон',
      lastName: 'Доу',
      middleName: 'Александрович',
      dateOfBirth: new Date('1985-05-15'),
      email: 'john.doe@example.com',
      phone: '+79001234567',
      address: 'г. Москва, ул. Ленина, д. 10, кв. 5',
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
    },
  });

  const client2 = await prisma.client.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      firstName: 'Джейн',
      lastName: 'Смит',
      dateOfBirth: new Date('1990-08-22'),
      email: 'jane.smith@example.com',
      phone: '+79009876543',
      address: 'г. Санкт-Петербург, Невский пр., д. 25',
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
    },
  });

  const client3 = await prisma.client.upsert({
    where: { email: 'alex.petrov@example.com' },
    update: {},
    create: {
      firstName: 'Алексей',
      lastName: 'Петров',
      middleName: 'Иванович',
      dateOfBirth: new Date('1978-12-03'),
      email: 'alex.petrov@example.com',
      phone: '+79005551234',
      address: 'г. Казань, ул. Баумана, д. 45',
      status: 'ACTIVE',
      kycStatus: 'PENDING',
    },
  });

  console.log('✅ Clients created');

  // Создание счетов
  const account1 = await prisma.account.create({
    data: {
      accountNumber: '40817810100000000001',
      clientId: client1.id,
      type: 'CURRENT',
      status: 'ACTIVE',
      currency: 'USD',
      balance: 15000.50,
    },
  });

  const account2 = await prisma.account.create({
    data: {
      accountNumber: '40817810200000000002',
      clientId: client1.id,
      type: 'SAVINGS',
      status: 'ACTIVE',
      currency: 'EUR',
      balance: 8500.00,
    },
  });

  const account3 = await prisma.account.create({
    data: {
      accountNumber: '40817810300000000003',
      clientId: client2.id,
      type: 'CURRENT',
      status: 'ACTIVE',
      currency: 'USD',
      balance: 25000.75,
    },
  });

  const account4 = await prisma.account.create({
    data: {
      accountNumber: '40817810400000000004',
      clientId: client2.id,
      type: 'CREDIT',
      status: 'ACTIVE',
      currency: 'USD',
      balance: -5000.00,
      creditLimit: 10000.00,
    },
  });

  const account5 = await prisma.account.create({
    data: {
      accountNumber: '40817810500000000005',
      clientId: client3.id,
      type: 'DEPOSIT',
      status: 'ACTIVE',
      currency: 'RUB',
      balance: 500000.00,
    },
  });

  console.log('✅ Accounts created');

  // Создание транзакций
  await prisma.transaction.createMany({
    data: [
      {
        type: 'CREDIT',
        status: 'COMPLETED',
        amount: 5000.00,
        currency: 'USD',
        description: 'Зачисление зарплаты',
        toAccountId: account1.id,
        createdAt: new Date('2026-05-01T10:00:00Z'),
      },
      {
        type: 'DEBIT',
        status: 'COMPLETED',
        amount: 150.00,
        currency: 'USD',
        description: 'Оплата коммунальных услуг',
        fromAccountId: account1.id,
        createdAt: new Date('2026-05-05T14:30:00Z'),
      },
      {
        type: 'TRANSFER',
        status: 'COMPLETED',
        amount: 1000.00,
        currency: 'USD',
        description: 'Перевод другу',
        fromAccountId: account1.id,
        toAccountId: account3.id,
        createdAt: new Date('2026-05-10T16:45:00Z'),
      },
      {
        type: 'CREDIT',
        status: 'COMPLETED',
        amount: 3000.00,
        currency: 'EUR',
        description: 'Пополнение счета',
        toAccountId: account2.id,
        createdAt: new Date('2026-05-12T09:15:00Z'),
      },
      {
        type: 'DEBIT',
        status: 'COMPLETED',
        amount: 2500.00,
        currency: 'USD',
        description: 'Покупка техники',
        fromAccountId: account3.id,
        createdAt: new Date('2026-05-15T11:20:00Z'),
      },
      {
        type: 'FEE',
        status: 'COMPLETED',
        amount: 25.00,
        currency: 'USD',
        description: 'Комиссия за обслуживание',
        fromAccountId: account4.id,
        createdAt: new Date('2026-05-18T08:00:00Z'),
      },
      {
        type: 'CREDIT',
        status: 'COMPLETED',
        amount: 10000.00,
        currency: 'RUB',
        description: 'Пополнение депозита',
        toAccountId: account5.id,
        createdAt: new Date('2026-05-20T13:30:00Z'),
      },
      {
        type: 'TRANSFER',
        status: 'PENDING',
        amount: 500.00,
        currency: 'USD',
        description: 'Перевод в обработке',
        fromAccountId: account1.id,
        toAccountId: account3.id,
        createdAt: new Date('2026-05-21T10:00:00Z'),
      },
    ],
  });

  console.log('✅ Transactions created');

  // Создание уведомлений
  await prisma.notification.createMany({
    data: [
      {
        type: 'LARGE_TRANSACTION',
        title: 'Крупная транзакция',
        message: 'Обнаружена транзакция на сумму $10,000',
        entityId: account5.id,
        isRead: false,
      },
      {
        type: 'NEW_CLIENT',
        title: 'Новый клиент',
        message: 'Зарегистрирован новый клиент: Алексей Петров',
        entityId: client3.id,
        isRead: false,
      },
      {
        type: 'SYSTEM_ALERT',
        title: 'Системное уведомление',
        message: 'Плановое обслуживание системы 25 мая в 02:00',
        isRead: true,
      },
    ],
  });

  console.log('✅ Notifications created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

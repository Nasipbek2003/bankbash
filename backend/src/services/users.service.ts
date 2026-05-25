import { prisma } from '../config/database';
import { SystemUserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { BadRequestError, NotFoundError } from '../utils/errors';

interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: SystemUserRole;
}

interface UpdateUserData {
  email?: string;
  fullName?: string;
  role?: SystemUserRole;
  isActive?: boolean;
  password?: string;
}

export class UsersService {
  async getUsers() {
    const users = await prisma.systemUser.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async getUserById(id: string) {
    const user = await prisma.systemUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    return user;
  }

  async createUser(data: CreateUserData) {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await prisma.systemUser.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Создаем пользователя
    const user = await prisma.systemUser.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async updateUser(id: string, data: UpdateUserData) {
    // Проверяем существование пользователя
    const existingUser = await prisma.systemUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    // Если обновляется email, проверяем уникальность
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.systemUser.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new BadRequestError('Пользователь с таким email уже существует');
      }
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      isActive: data.isActive,
    };

    // Если обновляется пароль, хешируем его
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    // Обновляем пользователя
    const user = await prisma.systemUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async deleteUser(id: string) {
    // Проверяем существование пользователя
    const existingUser = await prisma.systemUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError('Пользователь не найден');
    }

    // Удаляем пользователя (каскадно удалятся refresh tokens и audit logs)
    await prisma.systemUser.delete({
      where: { id },
    });

    return { message: 'Пользователь успешно удален' };
  }

  async toggleUserStatus(id: string) {
    const user = await prisma.systemUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    const updatedUser = await prisma.systemUser.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}

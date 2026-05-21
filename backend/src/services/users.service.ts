import { prisma } from '../config/database';

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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }
}

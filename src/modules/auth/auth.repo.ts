import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class AuthRepo {
  findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };
  create = async (option: Prisma.UserCreateArgs) => {
    return await prisma.user.create(option);
  };
  findOrUnique = async (option: Prisma.UserFindUniqueArgs) => {
    return await prisma.user.findUnique(option);
  };
  saveRefresh = async (refreshToken: string, userId: number, expiresAt: Date) => {
    return await prisma.refreshToken.upsert({
      where: { userId },
      update: {
        token: refreshToken,
        expiresAt,
      },
      create: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });
  };
}

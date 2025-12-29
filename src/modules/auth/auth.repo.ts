import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class AuthRepo {
  static findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };
  async create(option: Prisma.UserCreateArgs) {
    return await prisma.user.create(option);
  }
  async findOrUnique(option: Prisma.UserFindUniqueArgs) {
    return await prisma.user.findUnique(option);
  }
}

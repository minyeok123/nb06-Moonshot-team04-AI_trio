import { prisma } from '../../libs/prisma';

export class UserRepo {
  async findUserById(userId: number) {
    return await prisma.user.findUnique({ where: { id: userId! } });
  }
}

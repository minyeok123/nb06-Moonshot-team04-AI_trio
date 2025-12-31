import { prisma } from '../../libs/prisma';

export class UserRepo {
  findUserById = async (userId: number) => {
    return await prisma.user.findUniqueOrThrow({ where: { id: userId! } });
  };

  updateUserInfo = async (userId: number, password: string) => {
    return await await prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  };
}

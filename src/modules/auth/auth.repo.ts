import { prisma } from '../../libs/prisma';

export class AuthRepo {
  static findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };
}

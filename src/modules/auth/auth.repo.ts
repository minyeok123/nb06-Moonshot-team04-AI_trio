import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../../libs/constants';
import token from './utils/token';

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
  login = async (refresh: string, userId: number) => {
    const { exp } = jwt.verify(refresh, JWT_SECRET!) as JwtPayload;
    const expiresAt = new Date(exp! * 1000);
    const hashdRefreshToken = await token.hashRefreshToken(refresh);
    await prisma.refreshToken.upsert({
      where: { userId },
      create: {
        token: hashdRefreshToken,
        userId,
        expiresAt: expiresAt,
      },
      update: {
        token: hashdRefreshToken,
        expiresAt: expiresAt,
      },
    });
  };
}

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

  async findOAuthByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email }, include: { oauths: true } });
  }

  async updateOAuth(
    accessToken: string,
    refreshToken: string,
    exp: Date,
    sub: string,
    type: 'google' = 'google',
  ) {
    return await prisma.oauth.update({
      where: {
        provider_providerId: {
          provider: type,
          providerId: sub,
        },
      },
      data: {
        accessToken,
        refreshToken,
        expirationAt: exp,
      },
    });
  }

  async createOAuth(
    email: string,
    name: string,
    picture: string,
    encryptedAccess: string,
    encryptedRefresh: string,
    expiresAt: Date,
    sub: string,
    type: 'google' = 'google',
  ) {
    return await prisma.user.create({
      data: {
        email,
        name,
        profileImgUrl: picture,
        oauths: {
          create: {
            provider: type,
            providerId: sub,
            accessToken: encryptedAccess,
            refreshToken: encryptedRefresh,
            expirationAt: expiresAt,
          },
        },
      },
    });
  }
}

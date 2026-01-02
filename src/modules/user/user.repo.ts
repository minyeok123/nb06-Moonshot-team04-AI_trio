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

  findUserProjects = async ({
    userId,
    skip,
    take,
    orderBy,
  }: {
    userId: number;
    skip: number;
    take: number;
    orderBy: any;
  }) => {
    return prisma.project.findMany({
      where: {
        projectMembers: {
          some: {
            userId,
            memberStatus: 'accepted',
          },
        },
      },
      skip,
      take,
      orderBy,
      include: {
        projectMembers: true,
        tasks: true,
      },
    });
  };

  countUserProjects = async (userId: number) => {
    return prisma.project.count({
      where: {
        projectMembers: {
          some: {
            userId,
            memberStatus: 'accepted',
          },
        },
      },
    });
  };
}

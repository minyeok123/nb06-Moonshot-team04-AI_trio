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

  findMyTasks = async (userId: number, query: any) => {
    const { from, to, project_id, status, assignee_id, keyword } = query;

    return prisma.task.findMany({
      where: {
        projectId: project_id,
        status,
        userId: assignee_id,
        title: keyword ? { contains: keyword, mode: 'insensitive' } : undefined,
        AND: [
          from ? { startDate: { gte: new Date(from) } } : {},
          to ? { endDate: { lte: new Date(to) } } : {},
          {
            projects: {
              projectMembers: {
                some: {
                  userId,
                  memberStatus: 'accepted',
                },
              },
            },
          },
        ],
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImgUrl: true,
          },
        },
        taskWithTags: {
          include: {
            tags: true,
          },
        },
        files: {
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };
}

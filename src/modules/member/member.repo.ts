import { prisma } from '../../libs/prisma';

export class MemberRepo {
  findMembersByProjectId = async (projectId: number, skip: number, take: number) => {
    const [members, total] = await Promise.all([
      prisma.projectMember.findMany({
        where: { projectId },
        skip,
        take,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImgUrl: true,
              _count: {
                select: { tasks: true },
              },
            },
          },
          projectInvitation: {
            select: {
              id: true,
              invitationStatus: true,
            },
          },
        },
      }),

      prisma.projectMember.count({
        where: { projectId },
      }),
    ]);
    return { members, total };
  };

  findProjectMember = async (projectId: number, userId: number) => {
    const member = await prisma.projectMember.findFirst({ where: { projectId, userId } });
    return member;
  };
}

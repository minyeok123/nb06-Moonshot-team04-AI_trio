import { prisma } from '../../libs/prisma';

export class MemberRepo {
  findMembersByProjectId = async (projectId: number, skip: number, take: number) => {
    return await prisma.invitation.findMany({
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
        projectMember: {
          select: {
            memberStatus: true,
          },
        },
      },
    });
  };

  findProjectMember = async (projectId: number, userId: number) => {
    const member = await prisma.projectMember.findFirst({
      where: { projectId, userId },
      include: { projects: true, projectInvitation: true },
    });
    return member;
  };

  findProjectOwnerInfo = async (projectId: number) => {
    const member = await prisma.project.findFirst({
      where: { id: projectId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImgUrl: true,
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
    });
    return member;
  };

  findProjectIdByInvitationId = async (invitationId: number) => {
    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      select: { projectId: true },
    });
    return invitation?.projectId;
  };

  removeMember = async (projectId: number, userId: number) => {
    return prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      data: {
        memberStatus: 'rejected',
      },
    });
  };

  findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  };

  findInvitation = async (projectId: number, receiveUserId: number) => {
    return prisma.invitation.findFirst({ where: { projectId, receiveUserId } });
  };

  createInvitation = async (sendUserId: number, receiveUserId: number, projectId: number) => {
    return prisma.invitation.create({
      data: {
        sendUserId,
        receiveUserId,
        projectId,
        invitationStatus: 'pending',
      },
    });
  };

  resendInvitation = async (invitationId: number) => {
    return await prisma.$transaction([
      prisma.invitation.update({
        where: { id: invitationId },
        data: { invitationStatus: 'pending' },
      }),
      prisma.projectMember.update({
        where: { invitationId },
        data: { memberStatus: 'accepted' },
      }),
    ]);
  };
}

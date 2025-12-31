import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export class InvitationRepo {
  findInvitationById = async (invitationId: number) => {
    return prisma.invitation.findUnique({ where: { id: invitationId } });
  };

  updateInvitationStatus = async (
    tx: Prisma.TransactionClient,
    invitationId: number,
    status: 'accepted' | 'rejected',
  ) => {
    return tx.invitation.update({
      where: { id: invitationId },
      data: { invitationStatus: status },
    });
  };

  createProjectMember = async (
    tx: Prisma.TransactionClient,
    userId: number,
    projectId: number,
    invitationId: number,
  ) => {
    return tx.projectMember.create({
      data: {
        userId,
        projectId,
        role: 'member',
        invitationId,
        memberStatus: 'accepted',
      },
    });
  };

  deleteInvitation = async (invitationId: number) => {
    return await prisma.invitation.delete({ where: { id: invitationId } });
  };
}

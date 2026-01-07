import { CustomError } from '../../libs/error';
import { prisma } from '../../libs/prisma';
import { InvitationRepo } from './invitation.repo';

export class InvitationService {
  constructor(private repo: InvitationRepo) {}

  acceptInvitation = async (invitationId: number, userId: number) => {
    const invitation = await this.repo.findInvitationById(invitationId);
    if (!invitation) throw new CustomError(404, '초대를 찾을 수 없습니다');
    if (invitation.invitationStatus !== 'pending')
      throw new CustomError(400, '이미 처리된 초대 입니다');
    if (invitation.receiveUserId !== userId)
      throw new CustomError(403, '초대 받은 유저만 수락할 수 있습니다');

    await prisma.$transaction(async (tx) => {
      await this.repo.updateInvitationStatus(tx, invitationId, 'accepted');
      await this.repo.createProjectMember(tx, userId, invitation.projectId, invitationId);
    });
    return;
  };

  removeInvitation = async (invitationId: number, userId: number) => {
    const invitation = await this.repo.findInvitationById(invitationId);
    if (!invitation) throw new CustomError(404, '초대를 찾을 수 없습니다');
    if (invitation.sendUserId !== userId) throw new CustomError(403, '권한이 없습니다');
    if (invitation.invitationStatus !== 'pending')
      throw new CustomError(400, '이미 처리된 초대는 삭제할 수 없습니다');
    await this.repo.deleteInvitation(invitationId);
  };
}

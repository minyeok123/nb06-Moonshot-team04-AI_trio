import { CustomError } from '@libs/error';
import { MemberRepo } from '@modules/member/member.repo';

export class MemberService {
  constructor(private repo: MemberRepo) {}

  getMembers = async (page: number, limit: number, projectId: number, userId: number) => {
    const member = await this.repo.findProjectMember(projectId, userId);
    if (!member) throw new CustomError(403, '프로젝트 멤버가 아닙니다');

    const owner = await this.repo.findProjectOwnerInfo(projectId);
    const formattedOwner = {
      id: owner!.users.id,
      name: owner!.users.name,
      email: owner!.users.email,
      profileImage: owner!.users.profileImgUrl,
      taskCount: owner!.users._count.tasks,
      status: null,
      invitationId: null,
    };
    const skip = (page - 1) * limit;
    const members = await this.repo.findMembersByProjectId(projectId, skip, limit);
    const acceptedMembers = members.filter(
      (m) => m.invitationStatus !== 'rejected' && m.projectMember?.memberStatus !== 'rejected',
    );
    const total = members.filter((m) => m.projectMember?.memberStatus === 'accepted');
    const formatted = acceptedMembers.map((m) => ({
      id: m.users.id,
      name: m.users.name,
      email: m.users.email,
      profileImage: m.users.profileImgUrl,
      taskCount: m.users._count.tasks,
      status: m.invitationStatus,
      invitationId: m.id,
    }));
    return {
      data: [formattedOwner, ...formatted],
      total: total.length + 1,
    };
  };

  removeMember = async (projectId: number, userId: number) => {
    const member = await this.repo.findProjectMember(projectId, userId);
    if (!member) throw new CustomError(404, '멤버를 찾을 수 없습니다');
    if (member.projects.ownerId === userId)
      throw new CustomError(400, '프로젝트 담당자는 멤버에서 제거할 수 없습니다');
    return await this.repo.removeMember(projectId, userId);
  };

  inviteMember = async (projectId: number, sendUserId: number, email: string) => {
    const user = await this.repo.findUserByEmail(email);
    if (!user) throw new CustomError(404, '사용자를 찾을 수 없습니다');

    const receiveUserId = user.id;
    const existingMember = await this.repo.findProjectMember(projectId, receiveUserId);
    if (existingMember && existingMember.memberStatus === 'accepted')
      throw new CustomError(400, '이미 프로젝트 멤버입니다');

    if (existingMember && existingMember.memberStatus === 'rejected') {
      const [invitation, projectMember] = await this.repo.resendInvitation(
        existingMember.invitationId!,
      );
      console.log(`초대 코드: ${invitation.id}`);
      return { invitationId: invitation.id.toString() };
    }

    if (!existingMember) {
      const invitation = await this.repo.createInvitation(sendUserId, receiveUserId, projectId);
      console.log(`초대 코드: ${invitation.id}`);
      return { invitationId: invitation.id.toString() };
    }
  };
}

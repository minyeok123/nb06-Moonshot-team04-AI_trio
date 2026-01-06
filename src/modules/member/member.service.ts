import { CustomError } from '../../libs/error';
import { MemberRepo } from './member.repo';

export class MemberService {
  constructor(private repo: MemberRepo) {}

  getMembers = async (page: number, limit: number, projectId: number, userId: number) => {
    const member = await this.repo.findProjectMember(projectId, userId);
    if (!member) throw new CustomError(403, '프로젝트 멤버가 아닙니다');

    const skip = (page - 1) * limit;
    const { members, total } = await this.repo.findMembersByProjectId(projectId, skip, limit);
    const formatted = members.map((m) => ({
      id: m.users.id,
      name: m.users.name,
      email: m.users.email,
      profileImage: m.users.profileImgUrl,
      taskCount: m.users._count.tasks,
      status: m.projectInvitation?.invitationStatus,
      invitationId: m.invitationId,
    }));

    return {
      data: formatted,
      total,
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
    if (existingMember) throw new CustomError(400, '이미 프로젝트 멤버입니다');

    const existingInvitation = await this.repo.findInvitation(projectId, receiveUserId);
    if (existingInvitation) throw new CustomError(400, '이미 초대된 사용자입니다');

    const invitation = await this.repo.createInvitation(sendUserId, receiveUserId, projectId);
    console.log(`초대 코드: ${invitation.id}`);
    return { invitationId: invitation.id.toString() };
  };
}

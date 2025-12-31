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
}

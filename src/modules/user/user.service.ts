import { User } from '../../types/user';
import { UserRepo } from './user.repo';
import bcrypt from 'bcrypt';
import { CustomError } from '../../libs/error';

type UserInfo = Pick<User, 'email' | 'name' | 'profileImgUrl'> & {
  currentPassword: string;
  newPassword: string;
  checkNewPassword: string;
};

export class UserService {
  constructor(private repo: UserRepo) {}

  // 내 정보 수정
  userInfoUpdate = async (data: UserInfo, userId: number) => {
    const user: User = await this.repo.findUserById(userId);
    if (!user) throw new CustomError(404, '사용자 확인이 필요합니다');

    // 기존 비밀번호 확인
    const oldPassword = data.currentPassword;

    const isMatch = await bcrypt.compare(oldPassword, user.password!);
    if (!isMatch) throw new CustomError(400, '기존 비밀번호 확인이 필요합니다');

    // 비밀번호가 있는 경우 비밀번호 업데이트
    const newPassword = data.newPassword;
    const checkNewPassword = data.checkNewPassword;

    if (oldPassword && newPassword && checkNewPassword) {
      if (oldPassword === newPassword)
        throw new CustomError(400, '기존 비밀번호와 신규 비밀번호가 같습니다');

      if (newPassword !== checkNewPassword)
        throw new CustomError(400, '신규 비밀번호와 신규확인 비밀번호가 다릅니다');

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await this.repo.updateUserPassword(userId, hashedNewPassword);
    }

    // 이미지가 있는 경우 이미지 업데이트
    const profileImgUrl = data.profileImgUrl ?? null;

    if (profileImgUrl) {
      await this.repo.updateUserImg(userId, profileImgUrl);
    }

    const userUpdate = await this.repo.findUserById(userId);
    const { password: _, ...userInfo } = userUpdate;

    return userInfo;
  };

  // 참여 중인 프로젝트 조회
  getMyProjectList = async ({
    userId,
    page,
    limit,
    order,
    orderByKey,
  }: {
    userId: number;
    page: number;
    limit: number;
    order: 'asc' | 'desc';
    orderByKey: 'created_at' | 'name';
  }) => {
    const limitNum = Number(limit);
    const skip = (page - 1) * limitNum;

    const orderBy = orderByKey === 'created_at' ? { createdAt: order } : { projectName: order };

    const projects = await this.repo.findUserProjects({
      userId,
      skip,
      take: limitNum,
      orderBy,
    });

    const data = projects.map((project) => {
      const todoCount = project.tasks.filter((t) => t.status === 'todo').length;
      const inProgressCount = project.tasks.filter((t) => t.status === 'in_progress').length;
      const doneCount = project.tasks.filter((t) => t.status === 'done').length;

      return {
        id: project.id,
        name: project.projectName,
        description: project.description,
        memberCount: project.projectMembers.length,
        todoCount,
        inProgressCount,
        doneCount,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });

    const total = data.length;

    return { data, total };
  };

  // 참여 중인 모든 프로젝트의 할 일 목록 조회
  getMyTaskList = async (userId: number, query: any) => {
    const tasks = await this.repo.findMyTasks(userId, query);

    return tasks.map((task) => ({
      id: task.id,
      projectId: task.projectId,
      title: task.title,

      startYear: task.startDate.getFullYear(),
      startMonth: task.startDate.getMonth() + 1,
      startDay: task.startDate.getDate(),

      endYear: task.endDate.getFullYear(),
      endMonth: task.endDate.getMonth() + 1,
      endDay: task.endDate.getDate(),

      status: task.status,

      assignee: task.users
        ? {
            id: task.users.id,
            name: task.users.name,
            email: task.users.email,
            profileImage: task.users.profileImgUrl,
          }
        : null,

      tags: task.taskWithTags.map((t) => ({
        id: t.tags.id,
        name: t.tags.tag,
      })),

      attachments: task.files.map((f) => f.url),

      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
  };
}

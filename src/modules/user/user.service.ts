import { User } from '../../types/user';
import { UserRepo } from './user.repo';
import bcrypt from 'bcrypt';
import { CustomError } from '../../libs/error';
import { BASE_URL } from '../../libs/constants';

type ChangePasswordInput = {
  currentPassword: string;
  newPassword?: string;
  checkNewPassword?: string;
};

export class UserService {
  constructor(private repo: UserRepo) {}

  mapResponse = (user: any): User => {
    const baseUrl = BASE_URL;

    const { password: _, ...userWithoutPW } = user;
    const profileImgUrl = userWithoutPW.profileImgUrl;
    let profileImage: string | null = null;

    if (profileImgUrl) {
      if (profileImgUrl.startsWith('http')) {
        profileImage = profileImgUrl;
      } else {
        profileImage = `${baseUrl}${profileImgUrl}`;
      }
    }

    return {
      ...userWithoutPW,
      profileImage,
    };
  };

  getUserInfo = async (userId: number) => {
    const user: User = await this.repo.findUserById(userId);
    if (!user) throw new CustomError(404, '사용자 확인이 필요합니다');

    return this.mapResponse(user);
  };

  // 내 정보 수정 - 패스워드
  changePassword = async (data: ChangePasswordInput, userId: number) => {
    const user: User = await this.repo.findUserById(userId);
    if (!user) throw new CustomError(404, '사용자 확인이 필요합니다');

    // 기존 비밀번호 확인
    const oldPassword = data.currentPassword;

    const isMatch = await bcrypt.compare(oldPassword, user.password!);
    if (!isMatch) throw new CustomError(400, '기존 비밀번호 확인이 필요합니다');

    // 비밀번호가 있는 경우 비밀번호 업데이트
    const newPassword = data.newPassword;

    if (oldPassword && newPassword) {
      if (oldPassword === newPassword)
        throw new CustomError(400, '기존 비밀번호와 신규 비밀번호가 같습니다');

      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await this.repo.updateUserPassword(userId, hashedNewPassword);
    }

    const userUpdate = await this.repo.findUserById(userId);
    return this.mapResponse(userUpdate);
  };

  // 내 정보 수정 - 이미지
  updateProfileImage = async (profileImgUrl: string, userId: number) => {
    // 이미지가 있는 경우 이미지 업데이트
    await this.repo.updateUserImg(userId, profileImgUrl);

    const userUpdate = await this.repo.findUserById(userId);
    return this.mapResponse(userUpdate);
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

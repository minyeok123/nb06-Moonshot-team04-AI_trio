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

  userInfoUpdate = async (data: UserInfo, userId: number) => {
    // 이미지 업로드 준비
    const profileImgUrl = data.profileImgUrl ?? null;

    // 유저 정보 불러와 데이터 사용
    const user: User = await this.repo.findUserById(userId);
    if (!user) throw new CustomError(404, '사용자 확인이 필요합니다');

    // 기존 비밀번호, 신규 비밀번호, 신규 비밀번호 확인 불러오기
    const oldPassword = data.currentPassword;
    const newPassword = data.newPassword;
    const checkNewPassword = data.checkNewPassword;

    let userUpdate;

    // 비밀번호가 있는 경우 해당 내용 함께 업데이트 적용
    if (oldPassword && newPassword && checkNewPassword) {
      // 신규 입력 비밀번호 확인
      if (newPassword !== checkNewPassword)
        throw new CustomError(401, '신규 비밀번호와 신규확인 비밀번호가 다릅니다');

      // 사용자가 입력 한 데이터와 서버 데이터가 동일한지 확인
      const isMatch = await bcrypt.compare(oldPassword, user.password!);
      if (!isMatch) throw new CustomError(401, '기존 비밀번호와 일치하지 않습니다');

      // 비밀번호 DB에 업데이트 전 해싱 작업 진행
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // 비밀번호 업데이트 이후, 나머지 정보만 제공
      userUpdate = await this.repo.updateUserInfoAll(userId, profileImgUrl, hashedNewPassword);
    } else {
      // 비밀번호가 없는 경우 이미지만 업데이트
      userUpdate = await this.repo.updateUserInfoImg(userId, profileImgUrl);
    }

    const { password: _, ...userInfo } = userUpdate;

    return userInfo;
  };

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

    const [projects, total] = await Promise.all([
      this.repo.findUserProjects({
        userId,
        skip,
        take: limitNum,
        orderBy,
      }),
      this.repo.countUserProjects(userId),
    ]);

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

    return { data, total };
  };

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

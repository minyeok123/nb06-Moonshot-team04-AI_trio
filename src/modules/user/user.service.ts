import { User } from '../../types/user';
import { UserRepo } from './user.repo';

import { prisma } from '../../libs/prisma';
import bcrypt from 'bcrypt';
import { CustomError } from '../../libs/error';

type UserInfo = Pick<User, 'email' | 'name' | 'profileImgUrl'> & {
  currentPassword: string;
  newPassword: string;
  checkNewPassword: string;
};

// API에서 받는 값(snake_case)
type OrderByApi = 'created_at' | 'name';

// Prisma(Project 모델)에서 쓰는 필드(camelCase)
type OrderByPrisma = 'createdAt' | 'projectName';
type OrderDir = 'asc' | 'desc';

type ProjectListItem = {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectListResponse = {
  data: ProjectListItem[];
  total: number;
};

export class UserService {
  constructor(private repo: UserRepo) {}

  userInfoUpdate = async (data: UserInfo, userId: number) => {
    // 기존 비밀번호, 신규 비밀번호, 신규 비밀번호 확인 불러오기
    const oldPassword = data.currentPassword;
    const newPassword = data.newPassword;
    const checkNewPassword = data.checkNewPassword;

    // 유저 정보 불러와 데이터 사용
    const user: User = await this.repo.findUserById(userId);
    if (!user) throw new CustomError(404, '사용자 확인이 필요합니다');

    // 사용자가 입력 한 데이터와 서버 데이터가 동일한지 확인
    const isMatch = await bcrypt.compare(oldPassword, user.password!);
    if (!isMatch) throw new CustomError(401, '기존 비밀번호와 일치하지 않습니다');

    // 신규 입력 비밀번호 확인
    if (newPassword !== checkNewPassword)
      throw new CustomError(401, '신규 비밀번호와 신규확인 비밀번호가 다릅니다');

    // 비밀번호 DB에 업데이트 전 해싱 작업 진행
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // 비밀번호 업데이트 이후, 나머지 정보만 제공
    const userUpdate = await this.repo.updateUserInfo(userId, hashedNewPassword);
    const { password: _, ...userInfo } = userUpdate;

    return userInfo;
  };

  getUserProjects = async ({
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
}

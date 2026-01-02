import { User } from '../../types/user';
import { TaskRepo } from './task.repo';
import bcrypt from 'bcrypt';
import { CustomError } from '../../libs/error';

export class TaskService {
  constructor(private repo: TaskRepo) {}

  createTask = async () => {
    // 비밀번호 업데이트 이후, 나머지 정보만 제공
    // const userUpdate = await this.repo.updateUserInfo(userId, hashedNewPassword);
    // const { password: _, ...userInfo } = userUpdate;
    // return userInfo;
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

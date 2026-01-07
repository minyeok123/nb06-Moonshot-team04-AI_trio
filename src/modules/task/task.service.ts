import { TaskRepo } from './task.repo';
import { CustomError } from '../../libs/error';
import { TaskStatus } from '@prisma/client';
import { BASE_URL } from '../../libs/constants';

type updateTaskBody = {
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: 'todo' | 'in_progress' | 'done';
  assigneeId: number;
  tags: string[];
  attachments: string[];
};

type UpdateTaskResult = {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: 'todo' | 'in_progress' | 'done';
  assignee: { id: number; name: string; email: string; profileImage: string | null } | null;
  tags: { id: number; name: string }[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
};

export class TaskService {
  constructor(private repo: TaskRepo) {}

  normalizeTags(tagNames: string[]) {
    return [...new Set(tagNames.map((t) => t.trim()).filter(Boolean))];
  }

  mapResponse = (task: any): UpdateTaskResult => {
    const start = task.startDate as Date;
    const end = task.endDate as Date;
    const baseUrl = BASE_URL;

    return {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      startYear: start.getFullYear(),
      startMonth: start.getMonth() + 1,
      startDay: start.getDate(),
      endYear: end.getFullYear(),
      endMonth: end.getMonth() + 1,
      endDay: end.getDate(),
      status: task.status,
      assignee: task.users
        ? {
            id: task.users.id,
            name: task.users.name,
            email: task.users.email,
            profileImage: task.users.profileImgUrl ?? null,
          }
        : null,
      tags: (task.taskWithTags ?? []).map((twt: any) => ({
        id: twt.tags.id,
        name: twt.tags.tag,
      })),
      attachments: task!.files.map((f: any) => `${baseUrl}${f.url}`),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  };

  createTask = async (userId: number, projectId: number, data: updateTaskBody) => {
    const startDate = new Date(data.startYear, data.startMonth - 1, data.startDay);
    const endDate = new Date(data.endYear, data.endMonth - 1, data.endDay);

    if (endDate < startDate) throw new CustomError(400, '잘못된 요청 입니다');

    const task = await this.repo.createTask({
      userId,
      projectId,
      title: data.title,
      status: data.status,
      startDate,
      endDate,
    });

    const taskId = task.id;

    if (data.tags.length > 0) {
      const normalizedTags = this.normalizeTags(data.tags);
      await this.repo.upsertTags(normalizedTags, taskId);
    }

    if (data.attachments.length > 0) {
      await this.repo.createFiles(task.id, data.attachments);
    }

    const createTask = await this.repo.findTaskWithRelations(task.id);

    return this.mapResponse(createTask);
  };

  taskList = async (
    projectId: number,
    query: {
      page: number;
      limit: number;
      status?: 'todo' | 'in_progress' | 'done';
      assignee?: number;
      keyword?: string;
      order: 'asc' | 'desc';
      order_by: 'created_at' | 'name' | 'end_date';
    },
  ) => {
    const { data, total } = await this.repo.findManyWithTotal({
      projectId,
      ...query,
    });

    return {
      data: data.map((task: any) => this.mapResponse(task)),
      total,
    };
  };

  getTaskById = async (taskId: number) => {
    const task = await this.repo.findTaskInfoById(taskId);

    if (!task) {
      throw new CustomError(404, '존재하지 않는 Task 입니다.');
    }

    return this.mapResponse(task);
  };

  updateTask = async (taskId: number, data: updateTaskBody) => {
    const startDate = new Date(data.startYear, data.startMonth - 1, data.startDay);
    const endDate = new Date(data.endYear, data.endMonth - 1, data.endDay);

    if (endDate < startDate) throw new CustomError(400, '잘못된 요청 입니다');

    const updataTask = await this.repo.updateTaskCore({
      taskId,
      title: data.title,
      status: data.status as TaskStatus,
      startDate,
      endDate,
      assigneeId: data.assigneeId,
    });

    const normalizedTags = this.normalizeTags(data.tags);
    const tags = await this.repo.upsertTags(normalizedTags, taskId);

    // await this.repo.replaceTaskTags(
    //   taskId,
    //   tags.map((t) => t.id),
    // );
    await this.repo.replaceTaskFiles(taskId, data.attachments ?? []);

    const updated = await this.repo.getTaskForResponse(taskId);
    if (!updated) throw new CustomError(400, '데이터 업데이트 실패');

    return this.mapResponse(updated);
  };

  deleteTask = async (taskId: number) => {
    return this.repo.deleteTaskById(taskId);
  };
}

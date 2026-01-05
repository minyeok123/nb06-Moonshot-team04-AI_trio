import { User } from '../../types/user';
import { TaskRepo } from './task.repo';
import bcrypt from 'bcrypt';
import { CustomError } from '../../libs/error';
import { TaskStatus } from '@prisma/client';
import { UpdateTaskBodyDto } from './task.validator';

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

  createTask = async (
    userId: number,
    projectId: number,
    dto: {
      title: string;
      description: string | '';
      startYear: number;
      startMonth: number;
      startDay: number;
      endYear: number;
      endMonth: number;
      endDay: number;
      status: 'todo' | 'in_progress' | 'done';
      tags: string[];
      attachments: string[];
    },
  ) => {
    const startDate = new Date(dto.startYear, dto.startMonth - 1, dto.startDay);
    const endDate = new Date(dto.endYear, dto.endMonth - 1, dto.endDay);

    const task = await this.repo.createTask({
      userId,
      projectId,
      title: dto.title,
      description: dto.description,
      status: dto.status,
      startDate,
      endDate,
    });

    if (dto.tags.length > 0) {
      const normalizedTags = this.normalizeTags(dto.tags);
      await this.repo.upsertTags(normalizedTags);
    }

    if (dto.attachments.length > 0) {
      await this.repo.createFiles(task.id, dto.attachments);
    }

    const createTask = await this.repo.findTaskWithRelations(task.id);

    return {
      id: createTask!.id,
      projectId: createTask!.projectId,
      title: createTask!.title,
      startYear: createTask!.startDate.getFullYear(),
      startMonth: createTask!.startDate.getMonth() + 1,
      startDay: createTask!.startDate.getDate(),
      endYear: createTask!.endDate.getFullYear(),
      endMonth: createTask!.endDate.getMonth() + 1,
      endDay: createTask!.endDate.getDate(),
      status: createTask!.status,
      assignee: createTask!.users
        ? {
            id: createTask!.users.id,
            name: createTask!.users.name,
            email: createTask!.users.email,
            profileImage: createTask!.users.profileImgUrl,
          }
        : null,
      tags: createTask!.taskWithTags.map((t) => ({
        id: t.tags.id,
        name: t.tags.tag,
      })),
      attachments: createTask!.files.map((f) => f.url),
      createdAt: createTask!.createdAt,
      updatedAt: createTask!.updatedAt,
    };
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
      data: data.map((task) => ({
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
      })),
      total,
    };
  };

  getTaskById = async (taskId: number) => {
    const task = await this.repo.findTaskInfoById(taskId);

    if (!task) {
      throw new CustomError(404, '존재하지 않는 Task 입니다.');
    }

    const start = task.startDate;
    const end = task.endDate;

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
    };
  };

  toDate = (y: number, m: number, d: number) => {
    // JS Date month는 0-based
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  };

  mapResponse = (task: any): UpdateTaskResult => {
    const start = task.startDate as Date;
    const end = task.endDate as Date;

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
      attachments: (task.files ?? []).map((f: any) => f.url),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  };

  updateTask = async (taskId: number, dto: UpdateTaskBodyDto, requesterId: number) => {
    const startDate = this.toDate(dto.startYear, dto.startMonth, dto.startDay);
    const endDate = this.toDate(dto.endYear, dto.endMonth, dto.endDay);

    if (endDate < startDate) {
      const err: any = new Error('endDate must be >= startDate');
      err.status = 400;
      throw err;
    }

    await this.repo.updateTaskCore({
      taskId,
      title: dto.title,
      status: dto.status as TaskStatus,
      startDate,
      endDate,
      assigneeId: dto.assigneeId,
    });

    const normalizedTags = this.normalizeTags(dto.tags);
    const tags = await this.repo.upsertTags(normalizedTags);

    await this.repo.replaceTaskTags(
      taskId,
      tags.map((t) => t.id),
    );
    await this.repo.replaceTaskFiles(taskId, dto.attachments ?? []);

    const updated = await this.repo.getTaskForResponse(taskId);
    if (!updated) {
      const err: any = new Error('Task not found after update');
      err.status = 500;
      throw err;
    }

    return this.mapResponse(updated);
  };

  deleteTask = async (taskId: number) => {
    return this.repo.deleteTaskById(taskId);
  };
}

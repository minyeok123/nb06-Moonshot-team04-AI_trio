import { User } from '../../types/user';
import { TaskRepo } from './task.repo';
import bcrypt from 'bcrypt';
import { CustomError } from '../../libs/error';

interface createTypeBody {
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: 'todo' | 'in_progress' | 'done';
  tags: string[];
  attachments: string[];
}

export class TaskService {
  constructor(private repo: TaskRepo) {}

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
      const tags = await this.repo.upsertTags(dto.tags);
      await this.repo.createTaskTags(
        task.id,
        tags.map((t) => t.id),
      );
    }

    if (dto.attachments.length > 0) {
      await this.repo.createFiles(task.id, dto.attachments);
    }

    return this.repo.findTaskWithRelations(task.id);
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
}

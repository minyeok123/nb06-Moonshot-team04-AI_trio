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

// {
//   "id": number,
//   "projectId": number,
// 	"title": string,
// 	"startYear": number,
// 	"startMonth": number,
// 	"startDay": number,
// 	"endYear": number,
// 	"endMonth": number,
// 	"endDay": number,
// 	"status": "todo" | "in_progress" | "done",
// 	"assignee": { "id": number, "name": string, "email": string, "profileImage": string } | null,
// 	"tags": { "id": number, "name": "string" }[],
// 	"attachments": string[],
// 	"createdAt": Date,
// 	"updatedAt": Date,
//   }

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
}

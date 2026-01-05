import { NextFunction, Request, Response } from 'express';
import { TaskService } from './task.service';
import { TaskRepo } from './task.repo';
import { taskIdParamSchema, updateTaskBodySchema } from './task.validator';

const taskRepo = new TaskRepo();
const taskService = new TaskService(taskRepo);

export class TaskController {
  static createTask = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.projectId);
    const userId = req.user.id; // authenticate 미들웨어 전제

    const task = await taskService.createTask(userId, projectId, req.body);

    res.status(200).json({
      id: task!.id,
      projectId: task!.projectId,
      title: task!.title,
      startYear: task!.startDate.getFullYear(),
      startMonth: task!.startDate.getMonth() + 1,
      startDay: task!.startDate.getDate(),
      endYear: task!.endDate.getFullYear(),
      endMonth: task!.endDate.getMonth() + 1,
      endDay: task!.endDate.getDate(),
      status: task!.status,
      assignee: task!.users
        ? {
            id: task!.users.id,
            name: task!.users.name,
            email: task!.users.email,
            profileImage: task!.users.profileImgUrl,
          }
        : null,
      tags: task!.taskWithTags.map((t) => ({
        id: t.tags.id,
        name: t.tags.tag,
      })),
      attachments: task!.files.map((f) => f.url),
      createdAt: task!.createdAt,
      updatedAt: task!.updatedAt,
    });
  };

  static taskList = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.projectId);

    const data = req.query as any;

    const result = await taskService.taskList(projectId, data);

    res.status(200).json(result);
  };

  static getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = Number(req.params.taskId);

    const task = await taskService.getTaskById(taskId);

    res.status(200).json(task);
  };

  static updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = Number(req.params.taskId);
    const body = req.body;
    const userId = req.user.id;

    const result = await taskService.updateTask(taskId, body, userId);
    return res.status(200).json(result);
  };

  static deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = Number(req.params.taskId);

    await taskService.deleteTask(taskId);

    res.status(204).send();
  };
}

import { NextFunction, Request, Response } from 'express';
import { TaskService } from './task.service';
import { TaskRepo } from './task.repo';

const taskRepo = new TaskRepo();
const taskService = new TaskService(taskRepo);

export class TaskController {
  static createTask = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.projectId);
    const userId = req.user.id;

    const task = await taskService.createTask(userId, projectId, req.body);

    res.status(200).json(task);
  };

  static taskList = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.projectId);

    const data = req.validatedQuery as any;

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

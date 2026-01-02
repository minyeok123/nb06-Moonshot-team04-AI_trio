import { NextFunction, Request, Response } from 'express';
import { TaskService } from './task.service';
import { TaskRepo } from './task.repo';

const taskRepo = new TaskRepo();
const taskService = new TaskService(taskRepo);

export class TaskController {
  static createTask = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const task = await taskService.createTask();

    res.status(200).json(task);
  };
}

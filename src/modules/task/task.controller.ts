import { NextFunction, Request, Response } from 'express';
import { TaskService } from './task.service';
import { TaskRepo } from './task.repo';

const taskRepo = new TaskRepo();
const taskService = new TaskService(taskRepo);

export class TaskController {
  // 할 일 생성
  static createTask = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.projectId);
    const userId = req.user.id;

    const task = await taskService.createTask(userId, projectId, req.body);

    res.status(200).json(task);
  };

  // 프로젝트의 할 일 목록 조회
  static taskList = async (req: Request, res: Response, next: NextFunction) => {
    const projectId = Number(req.params.projectId);

    const data = req.validatedQuery as any;

    const task = await taskService.getTaskList(projectId, data);

    res.status(200).json(task);
  };

  // 할 일 상세 조회
  static getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = Number(req.params.taskId);

    const task = await taskService.getTaskById(taskId);

    res.status(200).json(task);
  };

  // 할 일 수정
  static updateTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = Number(req.params.taskId);
    const body = req.body;

    const task = await taskService.updateTask(taskId, body);
    return res.status(200).json(task);
  };

  // 할 일 삭제
  static deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    const taskId = Number(req.params.taskId);

    await taskService.deleteTask(taskId);

    res.status(204).send();
  };
}

import { NextFunction, Request, Response } from 'express';
import { SubtaskRepo } from './subtask.repo';
import { SubtaskService } from './subtask.service';

export class SubtaskController {
  static createSubtask = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;
    const { title } = req.body;
    const subtask = await subtaskService.createSubtask(Number(taskId), title);
    res.status(201).json(subtask);
  };

  static getSubtasks = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;
    const subtasks = await subtaskService.getSubtasks(Number(taskId));
    res.status(200).json(subtasks);
  };

  static getSubtask = async (req: Request, res: Response) => {
    const { subtaskId } = req.params;
    const subtask = await subtaskService.getSubtask(Number(subtaskId));
    res.status(200).json(subtask);
  };

  static updateSubtask = async (req: Request, res: Response) => {
    const { subtaskId } = req.params;
    const { title } = req.body;
    const subtask = await subtaskService.updateSubtask(Number(subtaskId), title);
    res.status(200).json(subtask);
  };

  static deleteSubtask = async (req: Request, res: Response) => {
    const { subtaskId } = req.params;
    await subtaskService.deleteSubtask(Number(subtaskId));
    res.status(204).send();
  };
}

const subtaskRepo = new SubtaskRepo();
const subtaskService = new SubtaskService(subtaskRepo);

import { NextFunction, Request, Response } from 'express';
import { ProjectRepo } from '@modules/project/project.repo';
import { ProjectService } from '@modules/project/project.service';

export class ProjectController {
  static createProject = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const userId = req.user.id;
    const project = await projectService.createProject(data, userId);
    return res.status(201).json(project);
  };

  static getProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as unknown as { projectId: number };
    const project = await projectService.getProject(projectId);
    return res.status(200).json(project);
  };

  static patchProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as unknown as { projectId: number };
    const data = req.body;
    const project = await projectService.patchProject(projectId, data);
    return res.status(200).json(project);
  };

  static deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as unknown as { projectId: number };
    await projectService.deleteProject(projectId);
    return res.status(204).send();
  };
}

const projectRepo = new ProjectRepo();
const projectService = new ProjectService(projectRepo);

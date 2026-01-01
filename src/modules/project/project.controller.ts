import { NextFunction, Request, Response } from 'express';
import { ProjectRepo } from './project.repo';
import { ProjectService } from './project.service';

export class ProjectController {
  static createProject = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const userId = req.user.id;
    const project = await projectService.createProject(data, userId);
    return res.status(201).send(project);
  };

  static getProject = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as unknown as { projectId: number };
    const userId = req.user.id;
    const project = await projectService.getProject(projectId, userId);
    return res.status(200).send(project);
  };
}

const projectRepo = new ProjectRepo();
const projectService = new ProjectService(projectRepo);

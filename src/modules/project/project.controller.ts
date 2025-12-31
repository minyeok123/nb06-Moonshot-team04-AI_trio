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
}

const projectRepo = new ProjectRepo();
const projectService = new ProjectService(projectRepo);

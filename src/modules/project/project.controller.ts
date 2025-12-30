import { NextFunction, Request, Response } from 'express';
import { ProjectRepo } from './project.repo';
import { ProjectService } from './project.service';
import { CreateProjectType } from './project.validator';

export class ProjectController {
  static createProject = async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as CreateProjectType;
    const project = await projectService.createProject(data);
  };
}

const projectRepo = new ProjectRepo();
const projectService = new ProjectService(projectRepo);

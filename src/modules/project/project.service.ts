import { ProjectRepo } from './project.repo';
import { Project } from '../../types/project';
import { prisma } from '../../libs/prisma';

type createProject = Pick<Project, 'projectName' | 'description'>;
export class ProjectService {
  constructor(private repo: ProjectRepo) {}

  createProject = async (options: createProject) => {
    const data = options;

    const project = await this.repo.create();
  };
}

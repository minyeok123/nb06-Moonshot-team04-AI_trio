import { ProjectRepo } from './project.repo';
import { Project } from '../../types/project';
import { CustomError } from '../../libs/error';

type createProject = Pick<Project, 'projectName' | 'description'>;

const TASK_STATUS = ['todo', 'in_progress', 'done'] as const;
type TaskStatus = (typeof TASK_STATUS)[number];

export class ProjectService {
  constructor(private repo: ProjectRepo) {}
  mapStatusCount(grouped: { status: TaskStatus; _count?: { status?: number } }[]) {
    return {
      todo: grouped.find((g) => g.status === 'todo')?._count?.status ?? 0,
      in_progress: grouped.find((g) => g.status === 'in_progress')?._count?.status ?? 0,
      done: grouped.find((g) => g.status === 'done')?._count?.status ?? 0,
    };
  }
  /* groupedTask 예시 
  [
  { _count: { status: 2 }, status: 'todo' },
  { _count: { status: 2 }, status: 'in_progress' },
  { _count: { status: 1 }, status: 'done' }
   ] 
  */

  createProject = async (data: createProject, userId: number) => {
    const { projectName, description } = data;

    const project = await this.repo.create({
      data: {
        projectName,
        description,
        ownerId: userId,
        projectMembers: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });
    const groupedTask = await this.repo.taskStatusCount({
      by: ['status'],
      where: { projectId: project.id },
      _count: { status: true },
    });

    const taskCounts = this.mapStatusCount(groupedTask);

    const response = {
      id: project['id'],
      name: project['projectName'],
      description: project['description'],
      memberCount: project['_count']['projectMembers'],
      todoCount: taskCounts['todo'],
      inProgressCount: taskCounts['in_progress'],
      doneCount: taskCounts['done'],
    };

    return response;
  };

  getProject = async (projectId: number, userId: number) => {
    const project = await this.repo.getProject({ where: { id: projectId } });
    if (!project) {
      throw new CustomError(404, '');
    }
    const groupedTask = await this.repo.taskStatusCount({
      by: ['status'],
      where: { projectId },
      _count: { status: true },
    });
    const taskCounts = this.mapStatusCount(groupedTask);
    const response = {
      id: project['id'],
      name: project['projectName'],
      description: project['description'],
      memberCount: project['_count']['projectMembers'],
      todoCount: taskCounts['todo'],
      inProgressCount: taskCounts['in_progress'],
      doneCount: taskCounts['done'],
    };
    return response;
  };
}

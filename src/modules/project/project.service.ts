import { ProjectRepo } from './project.repo';
import { Project } from '../../types/project';
import { prisma } from '../../libs/prisma';

type createProject = Pick<Project, 'projectName' | 'description'>;
export class ProjectService {
  constructor(private repo: ProjectRepo) {}

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
      select: {
        id: true,
        projectName: true,
        description: true,
        _count: {
          select: {
            projectMembers: true,
          },
        },
      },
    });
    console.log(project);
    const groupedTask = await this.repo.taskStatusCount({
      by: ['status'],
      where: { projectId: project.id },
      _count: { status: true },
    });

    const TASK_STATUS = ['todo', 'in_progress', 'done'] as const;
    type TaskStatus = (typeof TASK_STATUS)[number];

    function mapStatusCount(grouped: { status: TaskStatus; _count?: { status?: number } }[]) {
      return {
        todo: grouped.find((g) => g.status === 'todo')?._count?.status ?? 0,
        in_progress: grouped.find((g) => g.status === 'in_progress')?._count?.status ?? 0,
        done: grouped.find((g) => g.status === 'done')?._count?.status ?? 0,
      };
    }

    const taskCounts = mapStatusCount(groupedTask);
    console.log(taskCounts);

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

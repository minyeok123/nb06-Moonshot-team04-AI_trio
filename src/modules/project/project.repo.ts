import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class ProjectRepo {
  private readonly selectOption = {
    id: true,
    projectName: true,
    description: true,
    _count: {
      select: {
        projectMembers: true,
      },
    },
  } satisfies Prisma.ProjectSelect;

  createProject = async (data: Prisma.ProjectCreateArgs) => {
    return prisma.project.create({
      ...data,
      select: {
        ...this.selectOption,
      },
    });
  };

  taskStatusCount = async (options: {
    by: ['status'];
    where?: Prisma.TaskWhereInput;
    _count?: Prisma.TaskCountAggregateInputType;
  }) => {
    return prisma.task.groupBy(options);
  };

  getProject = async (options: Prisma.ProjectFindUniqueArgs) => {
    return prisma.project.findUnique({
      ...options,
      select: {
        ...this.selectOption,
      },
    });
  };

  patchProject = async (options: Prisma.ProjectUpdateArgs) => {
    return prisma.project.update({
      ...options,
      select: {
        ...this.selectOption,
      },
    });
  };

  deleteProject = async (options: Prisma.ProjectDeleteArgs) => {
    return prisma.project.delete(options);
  };
}

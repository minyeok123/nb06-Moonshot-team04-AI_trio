import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class ProjectRepo {
  createProject = async (data: Prisma.ProjectCreateArgs) => {
    return prisma.project.create({
      ...data,
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
  };

  patchProject = async (options: Prisma.ProjectUpdateArgs) => {
    return prisma.project.update({
      ...options,
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
  };
}

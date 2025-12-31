import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class ProjectRepo {
  create = async <T extends Prisma.ProjectCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProjectCreateArgs>,
  ): Promise<Prisma.ProjectGetPayload<T>> => {
    return prisma.project.create(args);
  };

  taskStatusCount = async (options: {
    by: ['status'];
    where?: Prisma.TaskWhereInput;
    _count?: Prisma.TaskCountAggregateInputType;
  }) => {
    return prisma.task.groupBy(options);
  };
}

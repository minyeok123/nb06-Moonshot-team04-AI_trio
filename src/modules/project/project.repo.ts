import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class ProjectRepo {
  create = async (options: Prisma.ProjectCreateArgs) => {
    return prisma.project.create(options);
  };
}

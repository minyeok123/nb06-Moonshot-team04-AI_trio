import { prisma } from '../../libs/prisma';

// interface createTask {
//   title: string;
//   status: 'todo' | 'in_progress' | 'done';
//   startDate: Date;
//   endDate: Date;
//   tags: string[];
//   files: string[] | null;
// }

export class TaskRepo {
  // findUserById = async (userId: number) => {
  //   return await prisma.user.findUniqueOrThrow({ where: { id: userId! } });
  // };

  // createTask = async (data: createTask, projectId: number, userId: number) => {
  //   return await prisma.task.create({
  //     data: {
  //       userId,
  //       projectId,
  //       ...data,
  //     },
  //   });
  // };

  createTask(data: {
    userId: number;
    projectId: number;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    startDate: Date;
    endDate: Date;
  }) {
    return prisma.task.create({
      data,
    });
  }

  async upsertTags(tagNames: string[]) {
    return Promise.all(
      tagNames.map((tag) =>
        prisma.tag.upsert({
          where: { tag },
          update: {},
          create: { tag },
        }),
      ),
    );
  }

  createTaskTags(taskId: number, tagIds: number[]) {
    return prisma.taskWithTags.createMany({
      data: tagIds.map((tagId) => ({
        taskId,
        tagId,
      })),
    });
  }

  createFiles(taskId: number, urls: string[]) {
    return prisma.file.createMany({
      data: urls.map((url) => ({
        taskId,
        url,
      })),
    });
  }

  findTaskWithRelations(taskId: number) {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImgUrl: true,
          },
        },
        taskWithTags: {
          include: {
            tags: true,
          },
        },
        files: true,
      },
    });
  }
}

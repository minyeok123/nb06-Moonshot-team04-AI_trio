import { prisma } from '../../libs/prisma';

type Order = 'asc' | 'desc';
type OrderBy = 'created_at' | 'name' | 'end_date';

export class TaskRepo {
  createTask = async (data: {
    userId: number;
    projectId: number;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    startDate: Date;
    endDate: Date;
  }) => {
    return prisma.task.create({
      data,
    });
  };

  upsertTags = async (tagNames: string[], taskId: number) => {
    return prisma.$transaction(async (tx) => {
      for (const tag of tagNames) {
        const tagInfo = await tx.tag.upsert({
          where: { tag },
          update: {},
          create: { tag },
        });

        await tx.taskWithTags.create({
          data: {
            taskId,
            tagId: tagInfo.id,
          },
        });
      }
    });
  };

  createFiles = (taskId: number, urls: string[]) => {
    return prisma.file.createMany({
      data: urls.map((url) => ({
        taskId,
        url,
      })),
    });
  };

  findTaskWithRelations = (taskId: number) => {
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
            tags: { select: { id: true, tag: true } },
          },
        },
        files: true,
      },
    });
  };

  findManyWithTotal = async (params: {
    projectId: number;
    page: number;
    limit: number;
    status?: 'todo' | 'in_progress' | 'done';
    assignee?: number; // userId
    keyword?: string;
    order: Order;
    order_by: OrderBy;
  }) => {
    const { projectId, page = 1, limit = 10, status, assignee, keyword, order, order_by } = params;

    const where = {
      projectId,
      ...(status ? { status } : {}),
      ...(assignee ? { userId: Number(assignee) } : {}),
      ...(keyword ? { title: { contains: keyword, mode: 'insensitive' as const } } : {}),
    };

    const orderBy = this.toOrderBy(order_by, order);
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    return await prisma.task.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
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
  };

  toOrderBy = (order_by: OrderBy, order: Order) => {
    // order_by 명세: created_at, name, end_date
    // name은 task.title로 해석 (응답에도 title만 있음)
    switch (order_by) {
      case 'created_at':
        return { createdAt: order };
      case 'end_date':
        return { endDate: order };
      case 'name':
        return { title: order };
      default:
        return { createdAt: order };
    }
  };

  findTaskInfoById = async (taskId: number) => {
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
            tags: {
              select: {
                id: true,
                tag: true,
              },
            },
          },
        },
        files: {
          select: {
            url: true,
          },
        },
      },
    });
  };

  updateTaskCore = async (args: {
    taskId: number;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    startDate: Date;
    endDate: Date;
    assigneeId: number; // Task.userId로 매핑
  }) => {
    return prisma.task.update({
      where: { id: args.taskId },
      data: {
        title: args.title,
        status: args.status,
        startDate: args.startDate,
        endDate: args.endDate,
        userId: args.assigneeId,
      },
    });
  };

  replaceTaskTags = async (taskId: number, tagIds: number[]) => {
    await prisma.taskWithTags.deleteMany({ where: { taskId } });

    if (tagIds.length === 0) return;

    await prisma.taskWithTags.createMany({
      data: tagIds.map((tagId) => ({ taskId, tagId })),
      skipDuplicates: true,
    });
  };

  replaceTaskFiles = async (taskId: number, urls: string[]) => {
    await prisma.file.deleteMany({ where: { taskId } });

    const unique = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
    if (unique.length === 0) return;

    await prisma.file.createMany({
      data: unique.map((url) => ({ taskId, url })),
    });
  };

  getTaskForResponse = (taskId: number) => {
    return prisma.task.findUnique({
      where: { id: taskId },
      include: {
        users: true,
        taskWithTags: { include: { tags: true } },
        files: true,
      },
    });
  };

  deleteTaskById = async (taskId: number) => {
    return prisma.$transaction(async (taskDelete) => {
      await taskDelete.taskWithTags.deleteMany({
        where: { taskId },
      });

      await taskDelete.file.deleteMany({
        where: { taskId },
      });

      return taskDelete.task.delete({
        where: { id: taskId },
      });
    });
  };
}

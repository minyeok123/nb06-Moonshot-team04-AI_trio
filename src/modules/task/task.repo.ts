import { prisma } from '@libs/prisma';

type Order = 'asc' | 'desc';
type OrderBy = 'created_at' | 'name' | 'end_date';

export class TaskRepo {
  createTask = async (data: {
    userId: number;
    projectId: number;
    title: string;
    description: string;
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

        await tx.taskWithTags.upsert({
          where: { tagId_taskId: { taskId, tagId: tagInfo.id } },
          update: {},
          create: {
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
        files: {
          select: {
            url: true,
          },
        },
        subTasks: {
          select: {
            id: true,
            content: true,
            taskId: true,
            status: true,
          },
        },
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

    const [data, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
      }),
      prisma.task.count({ where }),
    ]);

    return { data, total };
  };

  toOrderBy = (order_by: OrderBy, order: Order) => {
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
        subTasks: {
          select: {
            id: true,
            content: true,
            taskId: true,
            status: true,
          },
        },
      },
    });
  };

  updateTaskCore = async (data: {
    taskId: number;
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'done';
    startDate?: Date;
    endDate?: Date;
    assigneeId: number; // Task.userId로 매핑
  }) => {
    return prisma.task.update({
      where: { id: data.taskId },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        userId: data.assigneeId,
      },
    });
  };

  replaceTaskFiles = async (taskId: number, urls: string[]) => {
    return prisma.$transaction(async (taskUpdate) => {
      await taskUpdate.file.deleteMany({ where: { taskId } });
      const unique = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
      if (unique.length === 0) return;
      await taskUpdate.file.createMany({
        data: unique.map((url) => ({ taskId, url })),
      });
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

  updateTaskEventId = async (taskId: number, calendarId: string) => {
    return await prisma.task.update({ where: { id: taskId }, data: { calendarId: calendarId } });
  };
}

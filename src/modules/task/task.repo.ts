import { prisma } from '../../libs/prisma';

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

  upsertTags = async (tagNames: string[]) => {
    return Promise.all(
      tagNames.map((tag) =>
        prisma.tag.upsert({
          where: { tag },
          update: {},
          create: { tag },
        }),
      ),
    );
  };

  createTaskTags = (taskId: number, tagIds: number[]) => {
    return prisma.taskWithTags.createMany({
      data: tagIds.map((tagId) => ({
        taskId,
        tagId,
      })),
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
            tags: true,
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
    const { projectId, page, limit, status, assignee, keyword, order, order_by } = params;

    const where = {
      projectId,
      ...(status ? { status } : {}),
      ...(assignee ? { userId: assignee } : {}),
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' as const } },
              { description: { contains: keyword, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const orderBy = this.toOrderBy(order_by, order);

    const skip = (page - 1) * limit;

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

  private toOrderBy(order_by: OrderBy, order: Order) {
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
  }
}

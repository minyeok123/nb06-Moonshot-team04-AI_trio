import { prisma } from '../../libs/prisma';

export class SubtaskRepo {
  createSubtask = async (taskId: number, title: string) => {
    return await prisma.subTask.create({
      data: {
        taskId: taskId,
        content: title,
      },
    });
  };

  getSubtasks = async (taskId: number) => {
    return await prisma.subTask.findMany({ where: { taskId } });
  };

  subtaskCount = async (taskId: number) => {
    return await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        _count: {
          select: {
            subTasks: true,
          },
        },
      },
    });
  };

  getSubtask = async (subtaskId: number) => {
    return prisma.subTask.findUnique({
      where: { id: subtaskId },
    });
  };

  updateSubtask = async (subtaskId: number, title: string) => {
    return prisma.subTask.update({
      where: { id: subtaskId },
      data: { content: title },
    });
  };

  deleteSubtask = async (subtaskId: number) => {
    return prisma.subTask.delete({
      where: { id: subtaskId },
    });
  };
}

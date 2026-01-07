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

  getSubtask = async (subtaskId: number) => {
    return prisma.subTask.findUnique({
      where: { id: subtaskId },
    });
  };

  updateSubtask = async (subtaskId: number, title: string, status: 'todo' | 'done') => {
    return prisma.subTask.update({
      where: { id: subtaskId },
      data: { content: title, status: status },
    });
  };

  deleteSubtask = async (subtaskId: number) => {
    return prisma.subTask.delete({
      where: { id: subtaskId },
    });
  };
}

import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class CommentRepo {
  createComment = async (options: Prisma.CommentCreateArgs) => {
    return prisma.comment.create({
      ...options,
      select: {
        id: true,
        content: true,
        taskId: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImgUrl: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  };
}

import { prisma } from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export class CommentRepo {
  private readonly selectOptions = {
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
  };

  createComment = async (options: Prisma.CommentCreateArgs) => {
    return prisma.comment.create({
      ...options,
      select: this.selectOptions,
    });
  };
  getCommentList = async (options: Prisma.CommentFindManyArgs) => {
    return prisma.comment.findMany({
      ...options,
      select: this.selectOptions,
    });
  };
  getCommentDetail = async (options: Prisma.CommentFindUniqueArgs) => {
    return prisma.comment.findUnique({
      ...options,
      select: this.selectOptions,
    });
  };
  updateComment = async (options: Prisma.CommentUpdateArgs) => {
    return prisma.comment.update({
      ...options,
      select: this.selectOptions,
    });
  };

  deleteComment = async (options: Prisma.CommentDeleteArgs) => {
    return prisma.comment.delete(options);
  };
}

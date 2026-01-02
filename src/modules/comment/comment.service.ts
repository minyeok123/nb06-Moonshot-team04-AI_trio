import { CommentRepo } from './comment.repo';
import { CustomError } from '../../libs/error';
import { Comment } from '../../types/comment';

type CreateComment = Pick<Comment, 'content'>;

export class CommentService {
  constructor(private repo: CommentRepo) {}

  createComment = async (taskId: number, userId: number, data: CreateComment) => {
    const { content } = data;
    const comment = await this.repo.createComment({
      data: {
        content,
        taskId,
        userId,
      },
    });

    const response = {
      id: comment['id'],
      content: comment['content'],
      taskId: comment['taskId'],
      author: {
        id: comment['users']['id'],
        name: comment['users']['email'],
        profileImage: comment['users']?.['profileImgUrl'],
      },
      createdAt: comment['createdAt'],
      updatedAt: comment['updatedAt'],
    };

    return response;
  };
}

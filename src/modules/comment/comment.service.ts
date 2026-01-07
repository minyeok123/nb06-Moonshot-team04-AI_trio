import { CommentRepo } from './comment.repo';
import { CustomError } from '../../libs/error';
import { Comment } from '../../types/comment';
import { mapResponse } from './dto/comment.dto';

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

    const response = mapResponse(comment);

    return response;
  };

  getCommentList = async (taskId: number, page: number, limit: number) => {
    const commentList = await this.repo.getCommentList({
      where: { taskId },
      skip: (page - 1) * limit,
      take: limit,
    });
    const commentCount = await this.repo.getCommentCount({
      where: { taskId },
    });

    const mappedList = commentList.map((comments) => ({
      id: comments['id'],
      content: comments['content'],
      taskId: comments['taskId'],
      author: {
        id: comments['users']['id'],
        name: comments['users']['name'],
        email: comments['users']['email'],
        profileImage: comments['users']?.['profileImgUrl'],
      },
      createdAt: comments['createdAt'],
      updatedAt: comments['updatedAt'],
    }));

    const response = { data: mappedList, total: commentCount };
    return response;
  };

  getCommentDetail = async (commentId: number) => {
    const comment = await this.repo.getCommentDetail({
      where: { id: commentId },
    });
    if (!comment) {
      throw new CustomError(404, '댓글을 찾을 수 없습니다.');
    }
    const response = mapResponse(comment);
    return response;
  };

  updateComment = async (commentId: number, content: string) => {
    const comment = await this.repo.updateComment({
      where: { id: commentId },
      data: {
        content,
      },
    });
    const response = mapResponse(comment);
    return response;
  };

  deletedComment = async (commentId: number) => {
    await this.repo.deleteComment({
      where: { id: commentId },
    });
  };
}

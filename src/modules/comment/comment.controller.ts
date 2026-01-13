import { NextFunction, Request, Response } from 'express';
import { CommentRepo } from '@modules/comment/comment.repo';
import { CommentService } from '@modules/comment/comment.service';

export class CommentController {
  static createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params as unknown as { taskId: number };
    const userId = req.user.id;
    const data = req.body;
    const comment = await commentService.createComment(taskId, userId, data);
    return res.status(201).send(comment);
  };

  static getCommentList = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params as unknown as { taskId: number };
    const { page, limit } = req.validatedQuery as unknown as { page: number; limit: number };
    const commentList = await commentService.getCommentList(taskId, page, limit);
    return res.status(200).send(commentList);
  };

  static getCommentDetail = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params as unknown as { commentId: number };
    const comment = await commentService.getCommentDetail(commentId);
    return res.status(200).send(comment);
  };

  static updateComment = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params as unknown as { commentId: number };
    const { content } = req.body;
    const comment = await commentService.updateComment(commentId, content);
    return res.status(203).send(comment);
  };

  static deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params as unknown as { commentId: number };
    await commentService.deletedComment(commentId);
    return res.status(204).send();
  };
}

const commentRepo = new CommentRepo();
const commentService = new CommentService(commentRepo);

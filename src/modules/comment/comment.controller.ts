import { CommentRepo } from './comment.repo';
import { CommentService } from './comment.service';
import { NextFunction, Request, Response } from 'express';

export class CommentController {
  static createComment = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params as unknown as { taskId: number };
    const userId = req.user.id;
    const data = req.body;
    const comment = await commentService.createComment(taskId, userId, data);
    return res.status(201).send(comment);
  };
}

const commentRepo = new CommentRepo();
const commentService = new CommentService(commentRepo);

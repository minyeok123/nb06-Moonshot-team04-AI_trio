import express from 'express';
import asyncHandler from '../../libs/asyncHandler';
import authenticate from '../../middlewares/authenticate';
import { Authorize } from '../../middlewares/authorize';
import { CommentController } from './comment.controller';
import { tokenValidate, validate } from '../../middlewares/validate';
import { CreateCommentSchema, TaskIdParamsSchema } from './comment.validate';
const router = express.Router();

router.post(
  '/:taskId/comments',
  tokenValidate(),
  authenticate,
  validate(CreateCommentSchema),
  validate(TaskIdParamsSchema, 'params'),
  Authorize.commentAuthorize,
  asyncHandler(CommentController.createComment),
);

export default router;

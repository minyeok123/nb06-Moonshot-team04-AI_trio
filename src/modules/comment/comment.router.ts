import express from 'express';
import asyncHandler from '../../libs/asyncHandler';
import authenticate from '../../middlewares/authenticate';
import { Authorize } from '../../middlewares/authorize';
import { CommentController } from './comment.controller';
import { tokenValidate, validate } from '../../middlewares/validate';
import {
  CommentIdParamsSchema,
  CommentQuerySchema,
  CreateCommentSchema,
  PatchCommentSchema,
  TaskIdParamsSchema,
} from './comment.validate';
const router = express.Router();

router
  .post(
    '/:taskId/comments',
    tokenValidate(),
    authenticate,
    validate(CreateCommentSchema),
    validate(TaskIdParamsSchema, 'params'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.createComment),
  )
  .get(
    '/:taskId/comments',
    tokenValidate(),
    authenticate,
    validate(TaskIdParamsSchema, 'params'),
    validate(CommentQuerySchema, 'query'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.getCommentList),
  );
router
  .get(
    '/:commentId',
    tokenValidate(),
    authenticate,
    validate(CommentIdParamsSchema, 'params'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.getCommentDetail),
  )
  .patch(
    '/:commentId',
    tokenValidate(),
    authenticate,
    validate(CommentIdParamsSchema, 'params'),
    validate(PatchCommentSchema),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.updateComment),
  )
  .delete(
    '/:commentId',
    tokenValidate(),
    authenticate,
    validate(CommentIdParamsSchema, 'params'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.deleteComment),
  );

export default router;

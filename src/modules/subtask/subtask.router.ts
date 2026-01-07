import express from 'express';
import { tokenValidate, validate } from '../../middlewares/validate';
import authenticate from '../../middlewares/authenticate';
import { SubtaskController } from './subtask.controller';
import asyncHandler from '../../libs/asyncHandler';
import { createSubtaskBodySchema, taskIdParamsSchema } from './subtask.validator';
import { Authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/:taskId/subtasks',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(taskIdParamsSchema, 'params'),
  validate(createSubtaskBodySchema, 'body'),
  asyncHandler(SubtaskController.createSubtask),
);

router.get(
  '/:taskId/subtasks',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(taskIdParamsSchema, 'params'),
  asyncHandler(SubtaskController.getSubtasks),
);
export default router;

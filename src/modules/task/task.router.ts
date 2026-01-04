import express from 'express';
import { TaskController } from './task.controller';
import authenticate from '../../middlewares/authenticate';
import { Authorize } from '../../middlewares/authorize';
import asyncHandler from '../../libs/asyncHandler';
import { validate, tokenValidate } from '../../middlewares/validate';
import { taskValidator, listTaskQuerySchema } from './task.validator';

const router = express.Router();

router.post(
  '/:projectId/tasks',
  tokenValidate(),
  authenticate,
  // Authorize.projectMember,
  validate(taskValidator, 'body'),
  asyncHandler(TaskController.createTask),
);

router.get(
  '/:projectId/tasks',
  tokenValidate(),
  authenticate,
  // Authorize.projectMember,
  validate(listTaskQuerySchema, 'query'),
  asyncHandler(TaskController.taskList),
);

export default router;

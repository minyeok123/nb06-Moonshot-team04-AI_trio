import express from 'express';
import { TaskController } from './task.controller';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { validate, tokenValidate } from '../../middlewares/validate';
import { taskValidator, getTaskValidator } from './task.validator';

const router = express.Router();

router.post(
  '/:projectId/tasks',
  tokenValidate(),
  authenticate,
  validate(taskValidator, 'body'),
  asyncHandler(TaskController.createTask),
);

export default router;

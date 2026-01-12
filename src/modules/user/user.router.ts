import express from 'express';
import { UserController } from './user.controller';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { validate, tokenValidate } from '../../middlewares/validate';
import { getMyProjectValidator, getMyTaskValidator } from './user.validator';

const router = express.Router();

router.get('/me', tokenValidate(), authenticate, asyncHandler(UserController.userInfo));
router.patch('/me', tokenValidate(), authenticate, asyncHandler(UserController.userInfoChange));

router.get(
  '/me/projects',
  tokenValidate(),
  authenticate,
  validate(getMyProjectValidator, 'query'),
  asyncHandler(UserController.getMyProjects),
);

router.get(
  '/me/tasks',
  tokenValidate(),
  authenticate,
  validate(getMyTaskValidator, 'query'),
  asyncHandler(UserController.getMyTasks),
);

export default router;

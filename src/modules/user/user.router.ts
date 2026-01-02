import express from 'express';
import { UserController } from './user.controller';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { validate, tokenValidate } from '../../middlewares/validate';
import { userPasswordValidator, getMyProjectValidator, getMyTaskValidator } from './user.validator';

const router = express.Router();

router.get('/me', tokenValidate(), authenticate, asyncHandler(UserController.userInfo));
router.post(
  '/me',
  tokenValidate(),
  authenticate,
  validate(userPasswordValidator, 'body'),
  asyncHandler(UserController.userInfoChange),
);
router.get(
  '/me/tasks',
  tokenValidate(),
  authenticate,
  validate(getMyProjectValidator, 'query'),
  asyncHandler(UserController.getMyProjects),
);

router.get(
  '/me/projects',
  tokenValidate(),
  authenticate,
  validate(getMyTaskValidator, 'query'),
  asyncHandler(UserController.getMyTasks),
);

export default router;

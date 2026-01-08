import express from 'express';
import { UserController } from './user.controller';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import upload from '../../middlewares/upload';
import { validate } from '../../middlewares/validate';
import { userPasswordValidator, getMyProjectValidator, getMyTaskValidator } from './user.validator';
import { attachFilePath } from '../../middlewares/attachFilePath';

const router = express.Router();

router.get('/me', authenticate, asyncHandler(UserController.userInfo));
router.patch(
  '/me',
  authenticate,
  upload.single('profileImage'),
  attachFilePath,
  validate(userPasswordValidator, 'body'),
  asyncHandler(UserController.userInfoChange),
);

router.get(
  '/me/projects',
  authenticate,
  validate(getMyProjectValidator, 'query'),
  asyncHandler(UserController.getMyProjects),
);

router.get(
  '/me/tasks',
  authenticate,
  validate(getMyTaskValidator, 'query'),
  asyncHandler(UserController.getMyTasks),
);

export default router;

import express from 'express';
import { UserController } from './user.controller';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { validate } from '../../middlewares/validate';
import { userPasswordValidator, getProjectListValidator } from './user.validator';

const router = express.Router();

router.get('/me', authenticate, asyncHandler(UserController.userInfo));
router.post(
  '/me',
  authenticate,
  validate(userPasswordValidator, 'body'),
  asyncHandler(UserController.userInfoChange),
);
router.get(
  '/me/projects',
  authenticate,
  validate(getProjectListValidator, 'query'),
  asyncHandler(UserController.userJoinProjects),
);

export default router;

import express from 'express';
import { UserController } from './user.controller';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { validate } from '../../middlewares/validate';
import { userPasswordValidator } from './user.validator';
import upload from '../../middlewares/upload';

const router = express.Router();

router.get('/me', authenticate, asyncHandler(UserController.userInfo));
router.post(
  '/me',
  authenticate,
  upload.single('profileImg'),
  validate(userPasswordValidator, 'body'),
  asyncHandler(UserController.userInfoChange),
);

export default router;

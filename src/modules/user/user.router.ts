import express from 'express';
import { UserController } from './user.controller';
import asyncHandler from '../../libs/asyncHandler';
import authenticate from '../../middlewares/authenticate';

const router = express.Router();

router.get('/me', authenticate, asyncHandler(UserController.userInfo));

export default router;

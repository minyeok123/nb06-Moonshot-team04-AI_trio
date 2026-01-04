import express from 'express';
import { AuthController } from './auth.controller';
import asyncHandler from '../../libs/asyncHandler';
import { authenticateRefresh } from '../../middlewares/authenticate.refresh';
import upload from '../../middlewares/upload';
import { attachFilePath } from '../../middlewares/attachFilePath';

const router = express.Router();

//upload.single('files'),
router.post(
  '/register',
  upload.single('profileImage'),
  attachFilePath,
  asyncHandler(AuthController.register),
);
router.post('/login', asyncHandler(AuthController.login));
router.post('/refresh', authenticateRefresh, asyncHandler(AuthController.refresh));

export default router;

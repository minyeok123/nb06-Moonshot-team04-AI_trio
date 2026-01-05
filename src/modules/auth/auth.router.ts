import express from 'express';
import { AuthController } from './auth.controller';
import asyncHandler from '../../libs/asyncHandler';
import { authenticateRefresh } from '../../middlewares/authenticate.refresh';
import upload from '../../middlewares/upload';
import { attachFilePath } from '../../middlewares/attachFilePath';
import { verifyState } from '../../middlewares/googleAuth';

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
router.get('/google', asyncHandler(AuthController.googleLogin));
router.get('/google/callback', verifyState, asyncHandler(AuthController.googleCallback));

export default router;

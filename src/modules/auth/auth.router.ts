import express from 'express';
import { AuthController } from './auth.controller';
import asyncHandler from '../../libs/asyncHandler';
import upload from '../../middlewares/upload';

const router = express.Router();

//upload.single('files'),
router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
router.post('/refresh', asyncHandler(AuthController.refresh));

export default router;

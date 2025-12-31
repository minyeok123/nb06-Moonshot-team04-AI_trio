import express from 'express';
import { ProjectController } from './project.controller';
import asyncHandler from '../../libs/asyncHandler';
import { validate } from '../../middlewares/validate';
import { CreateProject } from './project.validator';
import authenticate from '../../middlewares/authenticate';

const router = express.Router();

router.post(
  '/',
  validate(CreateProject),
  authenticate,
  asyncHandler(ProjectController.createProject),
);
export default router;

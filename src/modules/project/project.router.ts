import express from 'express';
import { ProjectController } from './project.controller';
import asyncHandler from '../../libs/asyncHandler';
import { validate } from '../../middlewares/validate';
import { CreateProject } from './project.validator';

const router = express.Router();

router.post('/projects', validate(CreateProject), asyncHandler(ProjectController.createProject));

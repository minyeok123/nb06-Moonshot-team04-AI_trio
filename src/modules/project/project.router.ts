import express from 'express';
import { ProjectController } from './project.controller';
import asyncHandler from '../../libs/asyncHandler';
import { tokenValidate, validate } from '../../middlewares/validate';
import { CreateProject, paramsSchema, PatchProjectSchema, querySchema } from './project.validator';
import authenticate from '../../middlewares/authenticate';
import { Authorize } from '../../middlewares/authorize';

const router = express.Router();

router
  .post(
    '/',
    tokenValidate(),
    validate(CreateProject),
    authenticate,
    asyncHandler(ProjectController.createProject),
  )
  .get(
    '/:projectId',
    tokenValidate(),
    validate(paramsSchema, 'params'),
    authenticate,
    Authorize.projectMember,
    asyncHandler(ProjectController.getProject),
  )
  .patch(
    '/:projectId',
    tokenValidate(),
    validate(paramsSchema, 'params'),
    validate(PatchProjectSchema),
    authenticate,
    Authorize.existingProjectOwner,
    asyncHandler(ProjectController.patchProject),
  )
  .delete(
    '/:projectId',
    tokenValidate(),
    validate(paramsSchema, 'params'),
    authenticate,
    Authorize.existingProjectOwner,
    asyncHandler(ProjectController.deleteProject),
  );

export default router;

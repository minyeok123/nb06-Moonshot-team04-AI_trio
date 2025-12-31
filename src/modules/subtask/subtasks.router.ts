import express from 'express';
import { tokenValidate, validate } from '../../middlewares/validate';
import authenticate from '../../middlewares/authenticate';
import { SubtaskController } from './subtask.controller';
import asyncHandler from '../../libs/asyncHandler';
import { subtaskIdParamSchema, updateSubtaskBodySchema } from './subtask.validator';
import { Authorize } from '../../middlewares/authorize';

const router = express.Router();

router.get(
  '/:subtaskId',
  tokenValidate(),
  authenticate,
  Authorize.subtaskProjectMember,
  validate(subtaskIdParamSchema, 'params'),
  asyncHandler(SubtaskController.getSubtask),
);

router.patch(
  '/:subtaskId',
  tokenValidate(),
  authenticate,
  Authorize.subtaskProjectMember,
  validate(subtaskIdParamSchema, 'params'),
  validate(updateSubtaskBodySchema, 'body'),
  asyncHandler(SubtaskController.updateSubtask),
);

router.delete(
  '/:subtaskId',
  tokenValidate(),
  authenticate,
  Authorize.subtaskProjectMember,
  validate(subtaskIdParamSchema, 'params'),
  asyncHandler(SubtaskController.deleteSubtask),
);

export default router;

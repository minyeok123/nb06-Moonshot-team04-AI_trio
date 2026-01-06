import express from 'express';
import { InvitationController } from './invitation.controller';
import { tokenValidate, validate } from '../../middlewares/validate';
import { invitationIdParamsSchema } from './invitation.validator';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { Authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/:invitationId/accept',
  tokenValidate(),
  authenticate,
  validate(invitationIdParamsSchema, 'params'),
  asyncHandler(InvitationController.acceptInvitation),
);

router.delete(
  '/:invitationId/',
  tokenValidate(),
  authenticate,
  Authorize.projectOwner,
  validate(invitationIdParamsSchema, 'params'),
  asyncHandler(InvitationController.cancelInvitation),
);

export default router;

import express from 'express';
import { InvitationController } from './invitation.controller';
import { tokenValidate, validate } from '../../middlewares/validate';
import { acceptInvitationParamsSchema, cencelInvitationParamsSchema } from './invitation.validator';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { Authorize } from '../../middlewares/authorize';

const router = express.Router();

router.post(
  '/:invitationId/accept',
  tokenValidate(),
  authenticate,
  validate(acceptInvitationParamsSchema, 'params'),
  asyncHandler(InvitationController.acceptInvitation),
);

router.delete(
  '/:invitationId/',
  tokenValidate(),
  authenticate,
  Authorize.projectOwner,
  validate(cencelInvitationParamsSchema, 'params'),
  asyncHandler(InvitationController.cencelInvitation),
);

export default router;

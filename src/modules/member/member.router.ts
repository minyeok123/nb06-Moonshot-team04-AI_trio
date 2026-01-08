import express from 'express';
import { MemberController } from './member.controller';
import { validate } from '../../middlewares/validate';
import {
  getMemberParamsSchema,
  getMemberQuerySchema,
  deleteMemberParamsSchema,
  createMemberParamsSchema,
  createMemberBodySchema,
} from './member.validator';
import authenticate from '../../middlewares/authenticate';
import { Authorize } from '../../middlewares/authorize';
import asyncHandler from '../../libs/asyncHandler';

const router = express.Router();

router.get(
  '/:projectId/users',
  authenticate,
  validate(getMemberParamsSchema, 'params'),
  validate(getMemberQuerySchema, 'query'),
  asyncHandler(MemberController.getMembers),
);

router.delete(
  '/:projectId/users/:userId',
  authenticate,
  Authorize.projectOwner,
  validate(deleteMemberParamsSchema, 'params'),
  asyncHandler(MemberController.removeMember),
);

router.post(
  '/:projectId/invitations',
  authenticate,
  Authorize.projectOwner,
  validate(createMemberParamsSchema, 'params'),
  validate(createMemberBodySchema, 'body'),
  asyncHandler(MemberController.inviteMember),
);

export default router;

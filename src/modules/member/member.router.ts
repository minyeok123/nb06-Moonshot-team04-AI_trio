import express from 'express';
import { MemberController } from './member.controller';
import { tokenValidate, validate } from '../../middlewares/validate';
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
// tokenValidate,

router.get(
  '/:projectId/users',
  tokenValidate(),
  authenticate,
  validate(getMemberParamsSchema, 'params'),
  validate(getMemberQuerySchema, 'query'),
  asyncHandler(MemberController.getMembers),
);

router.delete(
  '/:projectId/users/:userId',
  tokenValidate(),
  authenticate,
  Authorize.projectOwner,
  validate(deleteMemberParamsSchema, 'params'),
  asyncHandler(MemberController.removeMember),
);

router.post(
  '/:projectId/invitations',
  tokenValidate(),
  authenticate,
  Authorize.projectOwner,
  validate(createMemberParamsSchema, 'params'),
  validate(createMemberBodySchema, 'body'),
  asyncHandler(MemberController.inviteMember),
);

export default router;

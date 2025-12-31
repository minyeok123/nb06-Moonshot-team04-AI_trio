import express from 'express';
import { MemberController } from './member.controller';
import { validate } from '../../middlewares/validate';
import { paginationParamsSchema, querySchema } from './member.validator';
import authenticate from '../../middlewares/authenticate';

const router = express.Router();

router.get(
  '/:projectId/users',
  authenticate,
  validate(paginationParamsSchema, 'params'),
  validate(querySchema, 'query'),
  MemberController.getMembers,
);

export default router;

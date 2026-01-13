import express from 'express';
import { InvitationController } from './invitation.controller';
import { tokenValidate, validate } from '../../middlewares/validate';
import { invitationIdParamsSchema } from './invitation.validator';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { Authorize } from '../../middlewares/authorize';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 프로젝트 멤버 및 초대 관리 API
 */

/**
 * @swagger
 * /invitations/{invitationId}/accept:
 *   post:
 *     summary: 초대 수락
 *     description: 프로젝트 초대를 수락합니다.
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 초대 ID
 *     responses:
 *       200:
 *         description: (없음)
 *       400:
 *         description:  "message: 잘못된 요청 형식"
 *       404:
 *         description: (없음)
 */

router.post(
  '/:invitationId/accept',
  tokenValidate(),
  authenticate,
  validate(invitationIdParamsSchema, 'params'),
  asyncHandler(InvitationController.acceptInvitation),
);

/**
 * @swagger
 * /invitations/{invitationId}:
 *   delete:
 *     summary: 초대 취소
 *     description: 발송한 초대를 취소합니다. (프로젝트 관리자 권한 필요)
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 초대 ID
 *     responses:
 *       204:
 *         description: (없음)
 *       400:
 *         description: "message: 잘못된 요청 형식"
 *       401:
 *         description: "message: 로그인이 필요합니다."
 *       403:
 *         description: "message: 권한이 없습니다."
 *       404:
 *         description: (없음)
 */

router.delete(
  '/:invitationId/',
  tokenValidate(),
  authenticate,
  Authorize.projectOwner,
  validate(invitationIdParamsSchema, 'params'),
  asyncHandler(InvitationController.cancelInvitation),
);

export default router;

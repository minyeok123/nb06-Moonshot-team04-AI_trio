import express from 'express';
import asyncHandler from '@libs/asyncHandler';
import authenticate from '@middlewares/authenticate';
import { tokenValidate, validate } from '@middlewares/validate';
import { Authorize } from '@middlewares/authorize';
import { MemberController } from '@modules/member/member.controller';
import {
  getMemberParamsSchema,
  getMemberQuerySchema,
  deleteMemberParamsSchema,
  createMemberParamsSchema,
  createMemberBodySchema,
} from '@modules/member/member.validator';

const router = express.Router();
// tokenValidate,
/**
 * @swagger
 * tags:
 *   name: Member
 *   description: 프로젝트 멤버 및 초대 관리 API
 */
/**
 * @swagger
 * /projects/{projectId}/users:
 *   get:
 *     summary: 프로젝트 멤버 목록 조회
 *     description: 프로젝트에 참여 중인 멤버 목록을 조회합니다.
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 프로젝트 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지 당 항목 수
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
 *                 total:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: "message: 잘못된 요청 형식"
 *       401:
 *         description: "message: 로그인이 필요합니다"
 *       403:
 *         description: "message: 프로젝트 멤버가 아닙니다"
 */

router.get(
  '/:projectId/users',
  tokenValidate(),
  authenticate,
  validate(getMemberParamsSchema, 'params'),
  validate(getMemberQuerySchema, 'query'),
  asyncHandler(MemberController.getMembers),
);

/**
 * @swagger
 * /projects/{projectId}/users/{userId}:
 *   delete:
 *     summary: 프로젝트 멤버 삭제
 *     description: 프로젝트에서 특정 멤버를 내보냅니다. (관리자 권한 필요)
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 프로젝트 ID
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 삭제할 멤버(유저) ID
 *     responses:
 *       204:
 *         description: (없음)
 *       400:
 *         description: "message: 잘못된 요청 형식"
 *       401:
 *         description: "message: 로그인이 필요합니다"
 *       403:
 *         description: "message: 프로젝트 관리자가 아닙니다"
 *       404:
 *         description: (없음)
 */

router.delete(
  '/:projectId/users/:userId',
  tokenValidate(),
  authenticate,
  Authorize.projectOwner,
  validate(deleteMemberParamsSchema, 'params'),
  asyncHandler(MemberController.removeMember),
);

/**
 * @swagger
 * /projects/{projectId}/invitations:
 *   post:
 *     summary: 프로젝트 멤버 초대
 *     description: 이메일로 사용자를 프로젝트에 초대합니다. (관리자 권한 필요)
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 프로젝트 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 초대할 사용자 이메일
 *                 example: "user@example.com"
 *     responses:
 *       201:
 *         description: 초대 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 invitationId:
 *                   type: string
 *                   description: 생성된 초대 ID
 *       400:
 *         description:   "message: 잘못된 요청 형식"
 *       401:
 *         description:   "message: 잘못된 요청 형식"
 *       403:
 *         description: "message: 프로젝트 관리자가 아닙니다"
 *
 */

router.post(
  '/:projectId/invitations',
  tokenValidate(),
  authenticate,
  Authorize.projectOwner,
  validate(createMemberParamsSchema, 'params'),
  validate(createMemberBodySchema, 'body'),
  asyncHandler(MemberController.inviteMember),
);
/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "홍길동"
 *         email:
 *           type: string
 *           example: "hong@example.com"
 *         profileImage:
 *           type: string
 *           nullable: true
 *           example: "/uploads/profile.jpg"
 *         taskCount:
 *           type: integer
 *           example: 5
 *         status:
 *           type: string
 *           nullable: true
 *           example: "accepted"
 *           description: "초대 상태 (accepted, pending 등) 또는 null (소유자)"
 *         invitationId:
 *           type: integer
 *           nullable: true
 *           example: 10
 */

export default router;

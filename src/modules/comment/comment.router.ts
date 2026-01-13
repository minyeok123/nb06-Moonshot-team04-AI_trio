import express from 'express';
import asyncHandler from '../../libs/asyncHandler';
import authenticate from '../../middlewares/authenticate';
import { Authorize } from '../../middlewares/authorize';
import { CommentController } from './comment.controller';
import { tokenValidate, validate } from '../../middlewares/validate';
import {
  CommentIdParamsSchema,
  CommentQuerySchema,
  CreateCommentSchema,
  PatchCommentSchema,
  TaskIdParamsSchema,
} from './comment.validate';

// Comment 전체 분류 - 전역 선언 영역
/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: 할일 하위의 댓글 관련 API 선언
 */

const router = express.Router();

// /tasks/:taskId/comments 요청
/**
 * @swagger
 * /tasks/{taskId}/comments :
 *   post:
 *     summary: 할 일에 댓글 추가
 *     tags: [Comment]
 *     description: 할일에 댓글을 등록합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/commentPost'
 *     responses:
 *       200:
 *         description: 댓글 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/comment'
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       401:
 *         description: "로그인이 필요합니다"
 *       403:
 *         description: "프로젝트 멤버가 아닙니다"
 */

/**
 * @swagger
 * /tasks/{taskId}/comments :
 *   get:
 *     summary: 할 일에 달린 댓글 조회
 *     tags: [Comment]
 *     description: 할일에 등록 된 댓글 목록을 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/commentListResponse'
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       401:
 *         description: "message : 로그인이 필요합니다"
 *       403:
 *         description: "message : 프로젝트 멤버가 아닙니다"
 */

router
  .post(
    '/:taskId/comments',
    tokenValidate(),
    authenticate,
    validate(CreateCommentSchema),
    validate(TaskIdParamsSchema, 'params'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.createComment),
  )
  .get(
    '/:taskId/comments',
    tokenValidate(),
    authenticate,
    validate(TaskIdParamsSchema, 'params'),
    validate(CommentQuerySchema, 'query'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.getCommentList),
  );

/**
 * @swagger
 * /tasks/{commentId} :
 *   get:
 *     summary: 댓글 조회
 *     tags: [Comment]
 *     description: 댓글을 개별 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/comment'
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       401:
 *         description: "message : 로그인이 필요합니다"
 *       403:
 *         description: "message : 프로젝트 멤버가 아닙니다"
 *       404:
 *         description: "(데이터 없음)"
 */

/**
 * @swagger
 * /tasks/{commentId} :
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comment]
 *     description: 댓글을 수정합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/commentPost'
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/comment'
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       401:
 *         description: "message : 로그인이 필요합니다"
 *       403:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                 type: string
 *             examples:
 *               notProjectMember:
 *                 value:
 *                   message: 프로젝트 멤버가 아닙니다
 *               notCommentAuth:
 *                 value:
 *                   message: 자신이 작성한 댓글만 수정할 수 있습니다
 *       404:
 *         description: "(데이터 없음)"
 */

/**
 * @swagger
 * /tasks/{commentId} :
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comment]
 *     description: 댓글을 삭제합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: (없음)
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       401:
 *         description: "message : 로그인이 필요합니다"
 *       403:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                 type: string
 *             examples:
 *               notProjectMember:
 *                 value:
 *                   message: 프로젝트 멤버가 아닙니다
 *               notCommentAuth:
 *                 value:
 *                   message: 자신이 작성한 댓글만 수정할 수 있습니다
 *       404:
 *         description: "(데이터 없음)"
 */

router
  .get(
    '/:commentId',
    tokenValidate(),
    authenticate,
    validate(CommentIdParamsSchema, 'params'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.getCommentDetail),
  )
  .patch(
    '/:commentId',
    tokenValidate(),
    authenticate,
    validate(CommentIdParamsSchema, 'params'),
    validate(PatchCommentSchema),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.updateComment),
  )
  .delete(
    '/:commentId',
    tokenValidate(),
    authenticate,
    validate(CommentIdParamsSchema, 'params'),
    Authorize.commentAuthorize,
    asyncHandler(CommentController.deleteComment),
  );

export default router;

// [최하단] Comment 스키마 설정
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     commentPost:
 *       type: object
 *       required: [ content ]
 *       properties:
 *         content:
 *           type: string
 *           example: "comment"
 *     comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         content:
 *           type: string
 *           example: "content"
 *         taskId:
 *           type: integer
 *           example: 1
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             name:
 *               type: string
 *               example: "username"
 *             email:
 *               type: string
 *               example: "user1@test.com"
 *             profileImage:
 *               type: string
 *               nullable: true
 *               example: "/uploads/profileImage.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-15T06:57:14.057Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-15T06:57:14.057Z"
 *     commentListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/comment'
 *         total:
 *           type: integer
 *           example: 12
 */

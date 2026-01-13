import express from 'express';
import { tokenValidate, validate } from '../../middlewares/validate';
import authenticate from '../../middlewares/authenticate';
import { SubtaskController } from './subtask.controller';
import asyncHandler from '../../libs/asyncHandler';
import { createSubtaskBodySchema, taskIdParamsSchema } from './subtask.validator';
import { Authorize } from '../../middlewares/authorize';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SubTask
 *   description: 서브태스크 관련 API
 */

/**
 * @swagger
 * /tasks/{taskId}/subtasks:
 *   post:
 *     summary: 하위 할 일 생성
 *     description: 특정 할 일에 새로운 하위 할 일를 생성합니다. 프로젝트 멤버만 생성 가능합니다.
 *     tags: [SubTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 태스크 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: 서브태스크 제목
 *                 example: "string"
 *     responses:
 *       201:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubTask'
 *       400:
 *         description: 잘못된 요청 (유효성 검사 실패 또는 존재하지 않는 태스크)
 *       401:
 *         description: 인증 실패 (토큰 없음/만료)
 *       403:
 *         description: 권한 없음 (프로젝트 멤버 아님)
 *       404:
 *         description: 리소스 찾을 수 없음
 */
router.post(
  '/:taskId/subtasks',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(taskIdParamsSchema, 'params'),
  validate(createSubtaskBodySchema, 'body'),
  asyncHandler(SubtaskController.createSubtask),
);
/**
 * @swagger
 * /tasks/{taskId}/subtasks:
 *   get:
 *     summary: 하위 할 일 목록 조회
 *     description: 특정 할 일의 모든 하위 할 일를 조회합니다.
 *     tags: [SubTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 태스크 ID
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
 *                     $ref: '#/components/schemas/SubTask'
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
  '/:taskId/subtasks',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(taskIdParamsSchema, 'params'),
  asyncHandler(SubtaskController.getSubtasks),
);
export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     SubTask:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "API 명세서 작성"
 *         taskId:
 *           type: integer
 *           example: 10
 *         status:
 *           type: string
 *           enum: [todo, done]
 *           example: "todo"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

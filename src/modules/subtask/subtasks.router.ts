import express from 'express';
import { tokenValidate, validate } from '../../middlewares/validate';
import authenticate from '../../middlewares/authenticate';
import { SubtaskController } from './subtask.controller';
import asyncHandler from '../../libs/asyncHandler';
import { subtaskIdParamSchema, updateSubtaskBodySchema } from './subtask.validator';
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
 * /subtasks/{subtaskId}:
 *    get:
 *      summary: 하위 할 일 조회
 *      description: 특정 하위 할 일 조회
 *      tags: [SubTask]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: subtaskId
 *          schema:
 *            type: integer
 *          required: true
 *          description: 하위 할 일 ID
 *      responses:
 *        200:
 *          description: 조회 성공
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SubTask'
 *        400:
 *          description: "message: 잘못된 요청 형식"
 *        401:
 *          description: "message: 로그인이 필요합니다"
 *        403:
 *          description: 	"message: 프로젝트 멤버가 아닙니다"
 */

router.get(
  '/:subtaskId',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(subtaskIdParamSchema, 'params'),
  asyncHandler(SubtaskController.getSubtask),
);
/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   patch:
 *     summary: 하위 할 일 수정
 *     description: 하위 할 일의 제목을 수정하거나 완료 상태를 토글합니다.
 *     tags: [SubTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 하위 할 일 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 수정할 제목
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubTask'
 *       400:
 *         description: "message: 잘못된 요청 형식"
 *       401:
 *         description: "message: 로그인이 필요합니다"
 *       403:
 *         description: "message: 프로젝트 멤버가 아닙니다"
 *       404:
 *         description: (없음)
 */

router.patch(
  '/:subtaskId',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(subtaskIdParamSchema, 'params'),
  validate(updateSubtaskBodySchema, 'body'),
  asyncHandler(SubtaskController.updateSubtask),
);
/**
 * @swagger
 * /subtasks/{subtaskId}:
 *   delete:
 *     summary: 하위 할 일 삭제
 *     description: 특정 하위 할 일을 삭제합니다.
 *     tags: [SubTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 하위 할 일 ID
 *     responses:
 *       204:
 *         description: (없음)
 *       400:
 *         description:  "message: 잘못된 요청 형식"
 *       401:
 *         description: "message: 로그인이 필요합니다"
 *       403:
 *         description: "message: 프로젝트 멤버가 아닙니다"
 *       404:
 *         description: (없음)
 */

router.delete(
  '/:subtaskId',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(subtaskIdParamSchema, 'params'),
  asyncHandler(SubtaskController.deleteSubtask),
);

export default router;

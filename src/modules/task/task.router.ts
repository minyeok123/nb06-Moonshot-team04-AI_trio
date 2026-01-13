import express from 'express';
import asyncHandler from '@libs/asyncHandler';
import authenticate from '@middlewares/authenticate';
import { Authorize } from '@middlewares/authorize';
import { validate, tokenValidate } from '@middlewares/validate';
import { TaskController } from '@modules/task/task.controller';
import {
  taskValidator,
  listTaskQuerySchema,
  taskIdParamSchema,
  updateTaskBodySchema,
} from '@modules/task/task.validator';

// TASK 전체 분류 - 전역 선언 영역
/**
 * @swagger
 * tags:
 *   name: Task
 *   description: TASK 관련 API
 */

const router = express.Router();

/**
 * @swagger
 * /projects/:projectId/tasks:
 *   post:
 *     summary: 프로젝트에 할 일 생성
 *     tags: [Task]
 *     description: 프로젝트 멤버가 할 일을 생성합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startYear
 *               - startMonth
 *               - startDay
 *               - endYear
 *               - endMonth
 *               - endDay
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *                 example: 할 일 제목
 *               startYear:
 *                 type: number
 *                 example: 2025
 *               startMonth:
 *                 type: number
 *                 example: 4
 *               startDay:
 *                 type: number
 *                 example: 15
 *               endYear:
 *                 type: number
 *                 example: 2025
 *               endMonth:
 *                 type: number
 *                 example: 4
 *               endDay:
 *                 type: number
 *                 example: 20
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["백엔드", "API"]
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/file.png"]
 *     responses:
 *       200:
 *         description: 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 projectId:
 *                   type: number
 *                 title:
 *                   type: string
 *                 startYear:
 *                   type: number
 *                 startMonth:
 *                   type: number
 *                 startDay:
 *                   type: number
 *                 endYear:
 *                   type: number
 *                 endMonth:
 *                   type: number
 *                 endDay:
 *                   type: number
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                 assignee:
 *                   nullable: true
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 형식
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 */

router.post(
  '/:projectId/tasks',
  tokenValidate(),
  authenticate,
  Authorize.projectMember,
  validate(taskValidator, 'body'),
  asyncHandler(TaskController.createTask),
);

/**
 * @swagger
 * /projects/:projectId/tasks:
 *   get:
 *     summary: 프로젝트의 할 일 목록 조회
 *     tags: [Task]
 *     description: 프로젝트 멤버가 프로젝트의 할 일 목록을 조건별로 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: number
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *           enum: [created_at, name, end_date]
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       projectId:
 *                         type: number
 *                       title:
 *                         type: string
 *                       startYear:
 *                         type: number
 *                       startMonth:
 *                         type: number
 *                       startDay:
 *                         type: number
 *                       endYear:
 *                         type: number
 *                       endMonth:
 *                         type: number
 *                       endDay:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [todo, in_progress, done]
 *                       assignee:
 *                         nullable: true
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           profileImage:
 *                             type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                             name:
 *                               type: string
 *                       attachments:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: number
 *       400:
 *         description: 잘못된 요청 형식
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 */

router.get(
  '/:projectId/tasks',
  tokenValidate(),
  authenticate,
  Authorize.projectMember,
  validate(listTaskQuerySchema, 'query'),
  asyncHandler(TaskController.taskList),
);

/**
 * @swagger
 * /tasks/:taskId:
 *   get:
 *     summary: 할 일 조회
 *     tags: [Task]
 *     description: 프로젝트 멤버가 특정 할 일을 단건 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 projectId:
 *                   type: number
 *                 title:
 *                   type: string
 *                 startYear:
 *                   type: number
 *                 startMonth:
 *                   type: number
 *                 startDay:
 *                   type: number
 *                 endYear:
 *                   type: number
 *                 endMonth:
 *                   type: number
 *                 endDay:
 *                   type: number
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                 assignee:
 *                   nullable: true
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 형식
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 할 일을 찾을 수 없음
 */

router.get(
  '/:taskId',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(taskIdParamSchema, 'params'),
  asyncHandler(TaskController.getTaskById),
);

/**
 * @swagger
 * /tasks/:taskId:
 *   patch:
 *     summary: 할 일 수정
 *     tags: [Task]
 *     description: 프로젝트 멤버가 할 일 정보를 수정합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               startYear:
 *                 type: number
 *               startMonth:
 *                 type: number
 *               startDay:
 *                 type: number
 *               endYear:
 *                 type: number
 *               endMonth:
 *                 type: number
 *               endDay:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *               assigneeId:
 *                 type: number
 *                 nullable: true
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 projectId:
 *                   type: number
 *                 title:
 *                   type: string
 *                 startYear:
 *                   type: number
 *                 startMonth:
 *                   type: number
 *                 startDay:
 *                   type: number
 *                 endYear:
 *                   type: number
 *                 endMonth:
 *                   type: number
 *                 endDay:
 *                   type: number
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                 assignee:
 *                   nullable: true
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 형식
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 할 일을 찾을 수 없음
 */

router.patch(
  '/:taskId',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(updateTaskBodySchema, 'body'),
  asyncHandler(TaskController.updateTask),
);

/**
 * @swagger
 * /tasks/:taskId:
 *   delete:
 *     summary: 할 일 삭제
 *     tags: [Task]
 *     description: 프로젝트 멤버가 할 일을 삭제합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       204:
 *         description: 삭제 성공 (응답 바디 없음)
 *       400:
 *         description: 잘못된 요청 형식
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 할 일을 찾을 수 없음
 */

router.delete(
  '/:taskId',
  tokenValidate(),
  authenticate,
  Authorize.taskOrSubtaskProjectMember,
  validate(taskIdParamSchema, 'params'),
  asyncHandler(TaskController.deleteTask),
);

export default router;

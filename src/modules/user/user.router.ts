import express from 'express';
import { UserController } from './user.controller';
import authenticate from '../../middlewares/authenticate';
import asyncHandler from '../../libs/asyncHandler';
import { validate, tokenValidate } from '../../middlewares/validate';
import { getMyProjectValidator, getMyTaskValidator } from './user.validator';

// USER 전체 분류 - 전역 선언 영역
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User 관련 API
 */

const router = express.Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [User]
 *     description: 로그인한 사용자의 정보를 조회합니다.
 *     security:
 *       - bearerAuth: []
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
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: testuser@example.com
 *                 name:
 *                   type: string
 *                   example: testuser
 *                 profileImage:
 *                   type: string
 *                   example: https://example.com/files/image.png
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 오류
 *       404:
 *         description: 유저 없음
 */

router.get('/me', tokenValidate(), authenticate, asyncHandler(UserController.userInfo));

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: 내 정보 수정
 *     tags: [User]
 *     description: |
 *       로그인한 사용자의 정보를 수정합니다.
 *
 *       - 기본적으로 유저 정보 수정 시 `currentPassword` 는 필수 입니다.
 *       - 비밀번호 변경 시 `currentPassword`와 `newPassword`를 **모두** 전달해야 합니다.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: testuser@example.com
 *               name:
 *                 type: string
 *                 example: testuser
 *               currentPassword:
 *                 type: string
 *                 example: oldPassword123
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *               profileImage:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/files/image.png
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
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 데이터 형식
 *       401:
 *         description: 인증 필요
 */

router.patch('/me', tokenValidate(), authenticate, asyncHandler(UserController.userInfoChange));

/**
 * @swagger
 * /users/me/projects:
 *   get:
 *     summary: 참여 중인 프로젝트 조회
 *     tags: [User]
 *     description: 로그인한 사용자가 참여 중인 프로젝트 목록을 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *           enum: [created_at, name]
 *           example: created_at
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
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       memberCount:
 *                         type: number
 *                       todoCount:
 *                         type: number
 *                       inProgressCount:
 *                         type: number
 *                       doneCount:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: number
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 필요
 */

router.get(
  '/me/projects',
  tokenValidate(),
  authenticate,
  validate(getMyProjectValidator, 'query'),
  asyncHandler(UserController.getMyProjects),
);

/**
 * @swagger
 * /users/me/tasks:
 *   get:
 *     summary: 참여 중인 모든 프로젝트의 할 일 목록 조회
 *     tags: [User]
 *     description: 로그인한 사용자가 참여 중인 모든 프로젝트의 할 일을 조건별로 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-01
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-01-31
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: number
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *       - in: query
 *         name: assignee_id
 *         schema:
 *           type: number
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   projectId:
 *                     type: number
 *                   title:
 *                     type: string
 *                   startYear:
 *                     type: number
 *                   startMonth:
 *                     type: number
 *                   startDay:
 *                     type: number
 *                   endYear:
 *                     type: number
 *                   endMonth:
 *                     type: number
 *                   endDay:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [todo, in_progress, done]
 *                   assignee:
 *                     nullable: true
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       profileImage:
 *                         type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *                   attachments:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: 잘못된 요청 형식
 *       401:
 *         description: 인증 필요
 */

router.get(
  '/me/tasks',
  tokenValidate(),
  authenticate,
  validate(getMyTaskValidator, 'query'),
  asyncHandler(UserController.getMyTasks),
);

export default router;

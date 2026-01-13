import express from 'express';
import { ProjectController } from './project.controller';
import asyncHandler from '../../libs/asyncHandler';
import { tokenValidate, validate } from '../../middlewares/validate';
import { CreateProject, paramsSchema, PatchProjectSchema } from './project.validator';
import authenticate from '../../middlewares/authenticate';
import { Authorize } from '../../middlewares/authorize';

// Project 전체 분류 - 전역 선언 영역
/**
 * @swagger
 * tags:
 *   name: Project
 *   description: 프로젝트 관련 API 선언
 */

const router = express.Router();

// /projects 요청
/**
 * @swagger
 * /projects :
 *   post:
 *     summary: 프로젝트 생성
 *     tags: [Project]
 *     description: 프로젝트를 생성합니다.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/projectRequestBody'
 *     responses:
 *       200:
 *         description: 프로젝트를 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/project'
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       401:
 *         description: "message : 로그인이 필요합니다"
 */

/**
 * @swagger
 * /projects/{projectId} :
 *   get:
 *     summary: 프로젝트 조회
 *     tags: [Project]
 *     description: 프로젝트를 조회합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 프로젝트를 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/project'
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       403:
 *         description: "message : 프로젝트 멤버가 아닙니다"
 *       404:
 *         description: "(데이터 없음)"
 */

/**
 * @swagger
 * /projects/{projectId} :
 *   patch:
 *     summary: 프로젝트 수정
 *     tags: [Project]
 *     description: 프로젝트를 수정합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/projectRequestBody'
 *     responses:
 *       200:
 *         description: 프로젝트를 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/project'
 *       400:
 *         description: "message : 잘못된 요청 형식"
 *       401:
 *         description: "message : 로그인이 필요합니다"
 *       403:
 *         description: "message : 프로젝트 멤버가 아닙니다"
 */

/**
 * @swagger
 * /projects/{projectId} :
 *   delete:
 *     summary: 프로젝트 삭제
 *     tags: [Project]
 *     description: 프로젝트를 삭제합니다.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *         description: "message : 프로젝트 멤버가 아닙니다"
 *       404:
 *         description: "(데이터 없음)"
 */

router
  .post(
    '/',
    tokenValidate(),
    validate(CreateProject),
    authenticate,
    asyncHandler(ProjectController.createProject),
  )
  .get(
    '/:projectId',
    tokenValidate(),
    validate(paramsSchema, 'params'),
    authenticate,
    Authorize.projectMember,
    asyncHandler(ProjectController.getProject),
  )
  .patch(
    '/:projectId',
    tokenValidate(),
    validate(paramsSchema, 'params'),
    validate(PatchProjectSchema),
    authenticate,
    Authorize.existingProjectOwner,
    asyncHandler(ProjectController.patchProject),
  )
  .delete(
    '/:projectId',
    tokenValidate(),
    validate(paramsSchema, 'params'),
    authenticate,
    Authorize.existingProjectOwner,
    asyncHandler(ProjectController.deleteProject),
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
 *     projectRequestBody:
 *       type: object
 *       required: [ content ]
 *       properties:
 *         name:
 *           type: string
 *           example: "프로젝트 1"
 *         description:
 *           type: string
 *           example: "프로젝트 1 설명"
 *     project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "프로젝트 1"
 *         description:
 *           type: string
 *           example: "프로젝트 1 설명"
 *         memberCount:
 *           type: integer
 *           example: 1
 *         todoCount:
 *           type: integer
 *           example: 0
 *         inProgressCount:
 *           type: integer
 *           example: 0
 *         doneCount:
 *           type: integer
 *           example: 0
 */

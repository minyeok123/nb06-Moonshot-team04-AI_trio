import express from 'express';
import asyncHandler from '@libs/asyncHandler';
import { authenticateRefresh } from '@middlewares/authenticate.refresh';
import { verifyState } from '@middlewares/googleAuth';
import { validate } from '@middlewares/validate';
import { loginBodySchema, registerBodySchema } from '@modules/auth/auth.validator';
import { AuthController } from '@modules/auth/auth.controller';

// Auth 전체 분류 - 전역 선언 영역
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User 등록/인증 관련 API 선언
 */

const router = express.Router();

// auth/register 요청
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 일반 회원 가입
 *     tags: [Auth]
 *     description: 일반 회원 가입을 진행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user1@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "userName"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/UserInfo'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                 type: string
 *             examples:
 *               duplicatedEmail:
 *                 value:
 *                   message: 이미 가입한 이메일입니다
 *               invalidData:
 *                 value:
 *                   message: 잘못된 데이터 형식입니다
 */

router.post(
  '/register',
  validate(registerBodySchema, 'body'),
  asyncHandler(AuthController.register),
);

// auth/login 요청
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 일반 회원 로그인
 *     tags: [Auth]
 *     description: 일반 회원 로그인을 진행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       201:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/LoginToken'
 *       400:
 *         description: "message : 잘못된 요청입니다"
 *       404:
 *         description: "message : 존재하지 않거나 비밀번호가 일치하지 않습니다"
 */
router.post('/login', validate(loginBodySchema, 'body'), asyncHandler(AuthController.login));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 토큰 재발급 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginToken'
 *       400:
 *         description: "message : 잘못된 요청입니다"
 *       401:
 *         description: "message : 토큰 만료"
 */
// security : Authorization 헤더가 필요 한 경우 "인증 필요"를 표기한 것
router.post('/refresh', authenticateRefresh, asyncHandler(AuthController.refresh));

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google OAuth 로그인 시작
 *     tags: [Auth]
 *     description: >
 *       Google OAuth 로그인을 시작합니다.
 *       해당 API를 호출하면 Google 로그인 페이지로 리다이렉트됩니다.
 *     responses:
 *       302:
 *         description: Google 로그인 페이지로 리다이렉트
 */
router.get('/google', asyncHandler(AuthController.googleLogin));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth 콜백
 *     tags: [Auth]
 *     description: >
 *       Google OAuth 인증 후 Google 서버가 호출하는 콜백 API입니다.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Google OAuth 인증 코드
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginToken'
 */

router.get('/google/callback', verifyState, asyncHandler(AuthController.googleCallback));

export default router;

// [최하단] Auth 스키마 설정
/**
 * @swagger
 * components:
 *   schemas:
 *     UserInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "user1@test.com"
 *         name:
 *           type: string
 *           example: "userName"
 *         profileImage:
 *           type: string
 *           nullable: true
 *           example: "/uploads/profileImage.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-15T06:57:14.057Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-15T06:57:14.057Z"
 *     Login:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "user1@test.com"
 *         password:
 *           type: string
 *           example: "password"
 *     LoginToken:
 *       type: object
 *       required: [ accessToken, refreshToken ]
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "string"
 *         refreshToken:
 *           type: string
 *           example: "string"
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

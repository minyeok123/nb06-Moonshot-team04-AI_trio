import express from 'express';
import upload from '@middlewares/upload';
import { FileController } from '@modules/file/file.controller';

// File 전체 분류 - 전역 선언 영역
/**
 * @swagger
 * tags:
 *   name: File
 *   description: File 등록 관련 API 선언
 */

const router = express.Router();

/**
 * @swagger
 * /files :
 *   post:
 *     summary: 파일 업로드
 *     tags: [File]
 *     description: 파일 업로드를 진행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [files]
 *             properties:
 *               files:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: string
 *                 example: "/uploads/profileImage.jpg"
 *       400:
 *         description: 파일이 존재하지 않습니다
 */
router.post('/', upload.single('files'), FileController.upload);

export default router;

import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

// 업로드 폴더 없으면 생성
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * 파일 저장 방식
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

// 허용할 파일 타입 : 이미지, 문서, 엑셀, 파워포인트 
// 프론트엔드에서 사용 할 파일 타입에 대해 1차 필터링 진행
const allowedMimeTypes = [
  // 이미지
  'image/jpeg',
  'image/png',
  'image/webp',

  // 문서
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // 엑셀
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  // 파워포인트
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

/**
 * 파일 필터
 */
function fileFilter(_req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('허용되지 않은 파일 형식입니다.'));
  }
  cb(null, true);
}

/**
 * multer 인스턴스
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;

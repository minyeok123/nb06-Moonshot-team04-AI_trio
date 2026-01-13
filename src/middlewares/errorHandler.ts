import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { CustomError } from '@libs/error';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction) {
  return res.status(404).send({ message: '잘못된 접근입니다.' });
}

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  // 1️⃣ Prisma known error 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: '이미 존재하는 값입니다',
        field: err.meta?.target,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: '요청한 리소스를 찾을 수 없습니다',
        field: err.meta?.target,
      });
    }
  }

  // 2️⃣ Zod validation error 처리
  if (err instanceof ZodError) {
    return res.status(400).json({
      // type: 'ZodError',
      // issues: err.issues,
      // message: err.message,
      message: '잘못된 데이터 형식',
    });
  }

  // 3️⃣ 커스텀 에러 처리
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // 4️⃣ 토큰 만료 처리
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: '토큰 만료',
    });
  }

  // 5️⃣ 기타 에러 처리
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    type: 'UnknownError',
    message: err.message || '서버 통신 오류',
  });
}

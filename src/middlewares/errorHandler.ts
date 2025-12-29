import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BaseError } from '../libs/error';

export function defaultNotFoundHandler(req: Request, res: Response, next: NextFunction) {
  return res.status(404).send({ message: '잘못된 접근입니다.' });
}

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.log(err);
  // 1️⃣ Prisma known error 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(400).json({
      type: 'PrismaClientKnownRequestError',
      code: err.code,
      message: err.message,
    });
  }

  // 2️⃣ Zod validation error 처리
  if (err instanceof ZodError) {
    return res.status(400).json({
      type: 'ZodError',
      issues: err.issues,
      message: err.message,
    });
  }

  // 3️⃣ 커스텀 에러 처리
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // 4️⃣ 기타 에러 처리
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    type: 'UnknownError',
    message: err.message || 'Internal Server Error',
  });
}

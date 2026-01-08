import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../libs/error';
import { prisma } from '../libs/prisma';
import { compareData } from '../modules/auth/utils/hash';
import Token from '../modules/auth/utils/token';

export const authenticateRefresh = async (req: Request, res: Response, next: NextFunction) => {
  const parseTokenFromHeader = (req: Request) => {
    const header = req.headers.authorization;
    if (!header) {
      throw new CustomError(401, '토큰이 없습니다');
    }

    const token = header?.split(' ')[1];
    return token;
  };

  try {
    const token = parseTokenFromHeader(req);
    const payload = Token.verifyRefreshToken(token);
    if (!payload) {
      throw new CustomError(401, '토큰 만료');
    }

    const savedRefreshToken = await prisma.refreshToken.findFirst({
      where: { userId: payload.id },
    });
    if (!savedRefreshToken) {
      throw new CustomError(401, '토큰이 없습니다');
    }

    const compareRefresh = await compareData(token, savedRefreshToken.token);
    if (!compareRefresh) {
      throw new CustomError(401, '잘못된 접근입니다');
    }

    req.refresh = { id: payload.id };
    next();
  } catch (e) {
    next(e);
  }
};

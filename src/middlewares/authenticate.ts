import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../libs/error';
import token from '../modules/auth/utils/token';
import { UserRepo } from '../modules/user/user.repo';

const userRepo = new UserRepo();

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new CustomError(401, '토큰 만료');
    const isAccessToken = authHeader.split(' ')[1];
    const payload = token.verifyAccessToken(isAccessToken);
    if (!payload) throw new CustomError(401, '토큰 만료');
    const user = await userRepo.findUserById(payload.userId);
    if (!user) throw new CustomError(404, '사용자 확인이 불가능합니다');
    const { password: _, ...userInfo } = user;
    req.user = userInfo;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;

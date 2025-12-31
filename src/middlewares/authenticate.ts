import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../libs/error';
import token from '../modules/auth/utils/token';
import { UserRepo } from '../modules/user/user.repo';

const userRepo = new UserRepo();

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new CustomError(401, '토큰 만료');
  }
  const isAccessToken = authHeader.split(' ')[1];

  try {
    const { userId } = token.verifyAccessToken(isAccessToken);

    const user = await userRepo.findUserById(userId);

    if (!user) throw new CustomError(404, '사용자 확인이 불가능합니다');

    const { password: _, ...userInfo } = user;

    req.user = userInfo;

    next();
  } catch (err) {
    throw new CustomError(404, '사용자 확인이 불가능합니다');
  }
};

export default authenticate;

import { NextFunction, Request, Response } from 'express';

// 최종 파일 분리 시 지우기
import { UserService } from './user.service';
import { UserRepo } from './user.repo';

const userRepo = new UserRepo();
const userService = new UserService(userRepo);

export class UserController {
  static userInfo = async (req: Request, res: Response, next: NextFunction) => {
    const checkUser = req.user;

    res.status(200).json(checkUser);
  };

  static userInfoChange = async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = await userService.userInfoUpdate(req.body, req.user.id);
    res.status(200).json({ message: '비밀번호가 변경 되었습니다', userInfo });
  };
}

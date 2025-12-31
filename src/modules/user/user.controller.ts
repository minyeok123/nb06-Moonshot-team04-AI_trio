import { NextFunction, Request, Response } from 'express';

// 최종 파일 분리 시 지우기
import { prisma } from '../../libs/prisma';
import bcrypt from 'bcrypt';
import { User } from '../../types/user';
import { CustomError } from '../../libs/error';

export class UserController {
  static userInfo = async (req: Request, res: Response, next: NextFunction) => {
    const checkUser = req.user;

    res.status(200).json(checkUser);
  };

  static userInfoChange = async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const user: User = await prisma.user.findUniqueOrThrow({ where: { id: req.user.id } });

    if (!user) throw new CustomError(404, '사용자 확인이 필요합니다');

    const isMatch = await bcrypt.compare(oldPassword, user.password!);

    if (!isMatch) throw new CustomError(401, '기존 비밀번호와 일치하지 않습니다');

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword },
    });
  };
}

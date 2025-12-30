import { NextFunction, Request, Response } from 'express';

export class UserController {
  static userInfo = async (req: Request, res: Response, next: NextFunction) => {
    const checkUser = req.user;

    // const { password: _, ...userInfo } = checkUser;

    res.status(200).json(checkUser);
  };
}

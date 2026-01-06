import { NextFunction, Request, Response } from 'express';
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
    const data = { ...req.body, profileImgUrl: req.body.img ?? null };
    const userInfo = await userService.userInfoUpdate(data, req.user.id);
    res.status(200).json(userInfo);
  };

  static getMyProjects = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, order, order_by } = req.query as any;
    const result = await userService.getMyProjectList({
      userId,
      page,
      limit,
      order,
      orderByKey: order_by,
    });

    res.status(200).json(result);
  };

  static getMyTasks = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const tasks = await userService.getMyTaskList(userId, req.query);
    res.status(200).json(tasks);
  };
}

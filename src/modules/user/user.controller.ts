import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';

const userRepo = new UserRepo();
const userService = new UserService(userRepo);

export class UserController {
  static userInfo = async (req: Request, res: Response, next: NextFunction) => {
    const checkUser = req.user;
    // authenticate에서 조회 한 정보 바로 사용

    res.status(200).json(checkUser);
  };

  static userInfoChange = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, profileImgUrl: req.body.img ?? null };
    const userInfo = await userService.userInfoUpdate(data, req.user.id);
    res.status(200).json(userInfo);
  };

  static getMyProjects = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { page, limit, order, order_by } = req.validatedQuery as any;
    const projectList = await userService.getMyProjectList({
      userId,
      page,
      limit,
      order,
      orderByKey: order_by,
    });

    res.status(200).json(projectList);
  };

  static getMyTasks = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const tasks = await userService.getMyTaskList(userId, req.validatedQuery);
    res.status(200).json(tasks);
  };
}

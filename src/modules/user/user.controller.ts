import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { toRelativeUploadPath } from '../../libs/uploadPath';
import { changePasswordValidator, userProfileImageValidator } from './user.validator';

const userRepo = new UserRepo();
const userService = new UserService(userRepo);

export class UserController {
  static userInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userInfo = await userService.getUserInfo(req.user.id);
    res.status(200).json(userInfo);
  };

  static userInfoChange = async (req: Request, res: Response, next: NextFunction) => {
    // [ 문제 상황 ]
    // 이미지만 변경하더래도 기존 비밀번호가 있어야 하는데,
    // 비밀번호가 입력되기 전에 파일 업로드 먼저 실행 되서 (/files 라우터 실행) zod 충돌 에러가 발생
    // 최종 방식 = 이미지 업로드와 비밀번호 업데이트를 각각 세분화 하여 필요한 작업이 실행 되도록 적용

    // 이미지가 바뀌는 경우 변경
    if (req.body.profileImage) {
      const data = userProfileImageValidator.parse(req.body);
      const profileImgUrl = toRelativeUploadPath(data.profileImage);

      const result = await userService.updateProfileImage(profileImgUrl!, req.user.id);
      return res.status(200).json(result);
    }

    // 비밀번호가 바뀌는 경우 변경
    if (req.body.currentPassword) {
      const data = changePasswordValidator.parse(req.body);
      const result = await userService.changePassword(data, req.user.id);
      return res.status(200).json(result);
    }
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

import { Request, Response, NextFunction } from 'express';

export class Authorize {
  static projectOwner = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: projectId로 프로젝트 조회 후 owner 확인
    next();
  };

  static projectMember = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: projectId로 멤버 확인
    next();
  };

  static ownerOnly = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: 댓글 등 작성자 확인
    next();
  };

  static googleCalendarLinked = async (req: Request, res: Response, next: NextFunction) => {
    // TODO: user.googleRefreshToken 존재 확인
    next();
  };
}

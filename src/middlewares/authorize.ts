import { Request, Response, NextFunction } from 'express';
import { MemberRepo } from '../modules/member/member.repo';
import { CustomError } from '../libs/error';

export class Authorize {
  static projectOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId, invitationId } = req.params;
      if (!projectId && !invitationId) throw new CustomError(404, '잘못된 요청입니다');
      const operatorId = req.user.id;
      let pid: number | undefined;
      if (projectId) pid = Number(projectId);
      if (invitationId) {
        const iid = await memberRepo.findProjectIdByInvitationId(Number(invitationId));
        pid = iid;
      }
      if (!pid) throw new CustomError(404, '잘못된 요청입니다');
      const member = await memberRepo.findProjectMember(pid, operatorId);
      if (!member) throw new CustomError(404, '프로젝트의 멤버가 아닙니다');
      if (member.role !== 'owner') throw new CustomError(403, '프로젝트 관리자가 아닙니다');
      next();
    } catch (e) {
      next(e);
    }
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

const memberRepo = new MemberRepo();

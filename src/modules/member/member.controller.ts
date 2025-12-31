import { NextFunction, Request, Response } from 'express';
import { MemberRepo } from './member.repo';
import { MemberService } from './member.service';

export class MemberController {
  static getMembers = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as unknown as { projectId: number };
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const userId = req.user.id;
    const members = await memberService.getMembers(page, limit, projectId, userId);
    res.status(200).json(members);
  };
}

const memberRepo = new MemberRepo();
const memberService = new MemberService(memberRepo);

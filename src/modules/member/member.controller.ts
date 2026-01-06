import { NextFunction, Request, Response } from 'express';
import { MemberRepo } from './member.repo';
import { MemberService } from './member.service';

export class MemberController {
  static getMembers = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as unknown as { projectId: number };
    const { page = 1, limit = 10 } = req.query as unknown as { page: number; limit: number };
    const userId = req.user.id;
    const members = await memberService.getMembers(Number(page), Number(limit), projectId, userId);
    res.status(200).json(members);
  };

  static removeMember = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId, userId } = req.params as unknown as { projectId: number; userId: number };
    const _ = await memberService.removeMember(projectId, userId);
    res.status(204).json();
  };

  static inviteMember = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params as unknown as { projectId: number };
    const { email } = req.body as { email: string };
    const sendUserId = req.user.id;
    const result = await memberService.inviteMember(projectId, sendUserId, email);
    res.status(201).json(result);
  };
}

const memberRepo = new MemberRepo();
const memberService = new MemberService(memberRepo);

import { NextFunction, Request, Response } from 'express';
import { InvitationRepo } from './invitation.repo';
import { InvitationService } from './invitation.service';

export class InvitationController {
  static acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const { invitationId } = req.params as unknown as { invitationId: number };
    const userId = req.user.id;
    await invitationService.acceptInvitation(invitationId, userId);
    res.sendStatus(200);
  };

  static cencelInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const { invitationId } = req.params as unknown as { invitationId: number };
    const userId = req.user.id;
    await invitationService.removeInvitation(invitationId, userId);
    res.sendStatus(204);
  };
}
const invitationRepo = new InvitationRepo();
const invitationService = new InvitationService(invitationRepo);

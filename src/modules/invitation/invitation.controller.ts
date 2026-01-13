import { NextFunction, Request, Response } from 'express';
import { InvitationRepo } from '@modules/invitation/invitation.repo';
import { InvitationService } from '@modules/invitation/invitation.service';

export class InvitationController {
  static acceptInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const { invitationId } = req.params as unknown as { invitationId: number };
    const userId = req.user.id;
    await invitationService.acceptInvitation(invitationId, userId);
    res.status(200).send();
  };

  static cancelInvitation = async (req: Request, res: Response, next: NextFunction) => {
    const { invitationId } = req.params as unknown as { invitationId: number };
    const userId = req.user.id;
    await invitationService.removeInvitation(invitationId, userId);
    res.status(204).send();
  };
}
const invitationRepo = new InvitationRepo();
const invitationService = new InvitationService(invitationRepo);

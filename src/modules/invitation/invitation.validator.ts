import { z } from 'zod';

export const acceptInvitationParamsSchema = z.object({
  invitationId: z.coerce.number().int().positive(),
});

export const cencelInvitationParamsSchema = z.object({
  invitationId: z.coerce.number().int().positive(),
});

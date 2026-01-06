import { z } from 'zod';

export const invitationIdParamsSchema = z.object({
  invitationId: z.coerce.number().int().positive(),
});

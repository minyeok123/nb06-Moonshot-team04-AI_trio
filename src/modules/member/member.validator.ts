import { z } from 'zod';

export const getMemberQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(10),
});

export const getMemberParamsSchema = z.object({
  projectId: z.coerce.number(),
});

export const deleteMemberParamsSchema = z.object({
  projectId: z.coerce.number(),
  userId: z.coerce.number(),
});

export const createMemberParamsSchema = z.object({
  projectId: z.coerce.number(),
});

export const createMemberBodySchema = z.object({
  email: z.string().email(),
});

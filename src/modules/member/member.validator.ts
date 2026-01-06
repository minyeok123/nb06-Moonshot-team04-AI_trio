import { z } from 'zod';

export const getMemberQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().max(100).positive().optional(),
});

export const getMemberParamsSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});

export const deleteMemberParamsSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

export const createMemberParamsSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});

export const createMemberBodySchema = z.object({
  email: z.email(),
});

import { z } from 'zod';

export const getMemberQuerySchema = z.object({
  page: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().default(1),
  ),
  limit: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().max(100).positive().default(10),
  ),
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

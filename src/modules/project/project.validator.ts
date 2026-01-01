import { z } from 'zod';

export const CreateProject = z.object({
  projectName: z.string().min(1).max(10),
  description: z.string().min(1).max(40),
});

export const paramsSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});

export const querySchema = z.object({
  page: z.coerce.number().int().default(1),
  sortBy: z.string(),
});

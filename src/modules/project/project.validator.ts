import { z } from 'zod';

export const CreateProject = z.object({
  name: z.string().min(1).max(10),
  description: z.string().min(1).max(40),
});

export const paramsSchema = z.object({
  projectId: z.coerce.number().int().positive(),
});

export const PatchProjectSchema = CreateProject.partial();

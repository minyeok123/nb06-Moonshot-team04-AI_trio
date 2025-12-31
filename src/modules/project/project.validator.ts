import { z } from 'zod';

export const CreateProject = z.object({
  projectName: z.string().min(1).max(10),
  description: z.string().min(1).max(40),
});

export type CreateProjectType = z.infer<typeof CreateProject>;

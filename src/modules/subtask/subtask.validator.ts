import z from 'zod';

export const taskIdParamsSchema = z.object({
  taskId: z.coerce.number().int().min(1),
});

export const createSubtaskBodySchema = z.object({
  title: z.string().min(1).max(100),
});

export const subtaskIdParamSchema = z.object({
  subtaskId: z.coerce.number().int().min(1),
});

export const updateSubtaskBodySchema = z.object({
  title: z.string().min(1).max(100),
});

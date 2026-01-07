import { z } from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(50),
});

export const PatchCommentSchema = CreateCommentSchema.partial();

export const TaskIdParamsSchema = z.object({
  taskId: z.coerce.number().int().positive(),
});

export const CommentIdParamsSchema = z.object({
  commentId: z.coerce.number().int().positive(),
});

export const CommentQuerySchema = z.object({
  page: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().default(1),
  ),

  limit: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().max(10).default(10),
  ),
});

import { z } from 'zod';

export const CreateCommentSchema = z.object({
  content: z.string(),
});

export const TaskIdParamsSchema = z.object({
  taskId: z.coerce.number().int().positive(),
});

export const CommentIdParamsSchema = z.object({
  commentId: z.coerce.number().int().positive(),
});

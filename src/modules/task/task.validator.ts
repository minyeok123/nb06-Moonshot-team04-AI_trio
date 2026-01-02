import { z } from 'zod';

export const taskValidator = z.object({
  email: z.email(),
  name: z.string(),
  currentPassword: z.string().min(8).max(16),
  newPassword: z.string().min(8).max(16),
  checkNewPassword: z.string().min(8).max(16),
});

export const getTaskValidator = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  order_by: z.enum(['created_at', 'name']).default('created_at').optional(),
});

import { z } from 'zod';

export const userPasswordValidator = z.object({
  email: z.email(),
  name: z.string(),
  currentPassword: z.string().min(8).max(16),
  newPassword: z.string().min(8).max(16),
  checkNewPassword: z.string().min(8).max(16),
});

export const getProjectListValidator = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  order: z.enum(['asc', 'desc']).default('desc'),
  order_by: z.enum(['created_at', 'name']).default('created_at'),
});

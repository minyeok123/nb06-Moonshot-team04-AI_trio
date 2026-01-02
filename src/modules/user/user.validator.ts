import { z } from 'zod';

export const userPasswordValidator = z.object({
  email: z.email(),
  name: z.string(),
  currentPassword: z.string().min(8).max(16),
  newPassword: z.string().min(8).max(16),
  checkNewPassword: z.string().min(8).max(16),
});

export const getMyProjectValidator = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  order_by: z.enum(['created_at', 'name']).default('created_at').optional(),
});

export const getMyTaskValidator = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  project_id: z.coerce.number().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  assignee_id: z.coerce.number().optional(),
  keyword: z.string().optional(),
});

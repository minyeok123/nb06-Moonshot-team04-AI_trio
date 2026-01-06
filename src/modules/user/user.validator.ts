import { z } from 'zod';

export const userPasswordValidator = z.object({
  email: z.email(),
  name: z.string(),
  profileImage: z.string().optional(),
  currentPassword: z.string().min(8).max(30).optional(),
  newPassword: z.string().min(8).max(30).optional(),
  checkNewPassword: z.string().min(8).max(30).optional(),
});

export const getMyProjectValidator = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(100).default(10).optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
  order_by: z.enum(['created_at', 'name']).default('created_at').optional(),
});

export const getMyTaskValidator = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  project_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  assignee_id: z.coerce.number().int().positive().optional(),
  keyword: z.string().optional(),
});

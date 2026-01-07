import { z } from 'zod';

export const userPasswordValidator = z.object({
  email: z.email(),
  name: z.string(),
  profileImage: z.string().optional(),
  currentPassword: z.string().min(8).max(30),
  newPassword: z.string().min(8).max(30).optional(),
  checkNewPassword: z.string().min(8).max(30).optional(),
});

export const getMyProjectValidator = z.object({
  page: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().default(1),
  ),
  limit: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().max(100).default(10),
  ),
  order: z.preprocess((v) => (v === '' ? 'desc' : v), z.enum(['asc', 'desc']).default('desc')),
  order_by: z.preprocess(
    (v) => (v === '' ? 'created_at' : v),
    z.enum(['created_at', 'name']).default('created_at'),
  ),
});

export const getMyTaskValidator = z.object({
  from: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional()),
  to: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional()),
  project_id: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().optional(),
  ),
  status: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.enum(['todo', 'in_progress', 'done']).optional(),
  ),
  assignee_id: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().optional(),
  ),
  keyword: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional()),
});

import { z } from 'zod';

export const taskValidator = z.object({
  title: z.string().min(1),
  description: z.string().min(1).default(''),
  startYear: z.coerce.number().int().positive().min(2026),
  startMonth: z.coerce.number().int().positive().min(1).max(12),
  startDay: z.coerce.number().int().positive().min(1).max(31),
  endYear: z.coerce.number().int().positive().min(2026),
  endMonth: z.coerce.number().int().positive().min(1).max(12),
  endDay: z.coerce.number().int().positive().min(1).max(31),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
});

export const listTaskQuerySchema = z.object({
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(100).default(10),

  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  assignee: z.coerce.number().positive().int().positive().optional(), // userId 필터로 사용
  keyword: z.string().trim().min(1).optional(),

  order: z.enum(['asc', 'desc']).default('desc'),
  order_by: z.enum(['created_at', 'name', 'end_date']).default('created_at'),
});

export const taskIdParamSchema = z.object({
  taskId: z.coerce.number().positive().int().positive(),
});

export const updateTaskBodySchema = z.object({
  title: z.string().min(1).max(200),
  startYear: z.coerce.number().positive().int().min(2026).max(3000),
  startMonth: z.coerce.number().positive().int().min(1).max(12),
  startDay: z.coerce.number().positive().int().min(1).max(31),

  endYear: z.coerce.number().positive().int().min(2026).max(3000),
  endMonth: z.coerce.number().positive().int().min(1).max(12),
  endDay: z.coerce.number().positive().int().min(1).max(31),

  status: z.enum(['todo', 'in_progress', 'done']),
  assigneeId: z.coerce.number().int().positive(),

  tags: z.array(z.string().min(1).max(50)).default([]),
  attachments: z.array(z.string().url()).default([]),
});

export type UpdateTaskBodyDto = z.infer<typeof updateTaskBodySchema>;
export type TaskIdParamDto = z.infer<typeof taskIdParamSchema>;

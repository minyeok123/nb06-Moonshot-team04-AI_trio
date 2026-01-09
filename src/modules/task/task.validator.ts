import { z } from 'zod';

const tagsSchema = z
  .preprocess((val) => {
    if (val === undefined || val === null || val === '') return [];

    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return parsed;
      } catch {
        return [val];
      }
    }

    return val;
  }, z.array(z.string()))
  .default([]);

export const taskValidator = z.object({
  title: z.string().min(1),
  startYear: z.coerce.number().int().positive().min(2026),
  startMonth: z.coerce.number().int().positive().min(1).max(12),
  startDay: z.coerce.number().int().positive().min(1).max(31),
  endYear: z.coerce.number().int().positive().min(2026),
  endMonth: z.coerce.number().int().positive().min(1).max(12),
  endDay: z.coerce.number().int().positive().min(1).max(31),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  tags: tagsSchema,
  attachments: z.array(z.string()).default([]),
});

export const listTaskQuerySchema = z.object({
  page: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().min(1).default(1),
  ),
  limit: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().int().positive().min(1).max(100).default(10),
  ),

  status: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.enum(['todo', 'in_progress', 'done']).optional(),
  ),
  assignee: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.coerce.number().positive().int().positive().optional(),
  ), // userId 필터로 사용
  keyword: z.preprocess((v) => (v === '' ? undefined : v), z.string().trim().min(1).optional()),

  order: z.preprocess((v) => (v === '' ? 'desc' : v), z.enum(['asc', 'desc']).default('desc')),
  order_by: z.preprocess(
    (v) => (v === '' ? 'created_at' : v),
    z.enum(['created_at', 'name', 'end_date']).default('created_at'),
  ),
});

export const taskIdParamSchema = z.object({
  taskId: z.coerce.number().positive().int().positive(),
});

export const updateTaskBodySchema = taskValidator.partial();

// z.object({
//   title: z.string().min(1).max(200),
//   description: z.string().min(1).max(300).default(''),
//   startYear: z.coerce.number().positive().int().min(2026).max(3000),
//   startMonth: z.coerce.number().positive().int().min(1).max(12),
//   startDay: z.coerce.number().positive().int().min(1).max(31),

//   endYear: z.coerce.number().positive().int().min(2026).max(3000),
//   endMonth: z.coerce.number().positive().int().min(1).max(12),
//   endDay: z.coerce.number().positive().int().min(1).max(31),

//   status: z.enum(['todo', 'in_progress', 'done']),
//   assigneeId: z.coerce.number().int().positive(),

//   tags: tagsSchema,
//   attachments: z.array(z.string()).default([]),
// });

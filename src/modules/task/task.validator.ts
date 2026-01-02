import { z } from 'zod';

export const taskValidator = z.object({
  title: z.string().min(1),
  description: z.string().min(1).default(''),
  startYear: z.coerce.number().int().min(2000),
  startMonth: z.coerce.number().int().min(1).max(12),
  startDay: z.coerce.number().int().min(1).max(31),
  endYear: z.coerce.number().int().min(2000),
  endMonth: z.coerce.number().int().min(1).max(12),
  endDay: z.coerce.number().int().min(1).max(31),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  tags: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
});

// export const getTaskValidator = z.object({
//   page: z.coerce.number().int().min(1).default(1).optional(),
//   limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
//   order: z.enum(['asc', 'desc']).default('desc').optional(),
//   order_by: z.enum(['created_at', 'name']).default('created_at').optional(),
// });

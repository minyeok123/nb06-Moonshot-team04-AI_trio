import { z } from 'zod';

export const userPasswordValidator = z.object({
  email: z.email(),
  name: z.string(),
  currentPassword: z.string().min(8).max(16),
  newPassword: z.string().min(8).max(16),
  checkNewPassword: z.string().min(8).max(16),
});

import z from 'zod';

export const registerBodySchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(30),
  password: z.string().min(8).max(30),
  profileImage: z.string().optional(),
});

export const loginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(30),
});

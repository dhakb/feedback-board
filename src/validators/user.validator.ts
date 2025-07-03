import { z } from "zod";


export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(4)
}).strict();

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
}).strict();

export const updateUserProfileSchema = z.object({
  email: z.string().email(),
  name: z.string().min(4)
}).strict();
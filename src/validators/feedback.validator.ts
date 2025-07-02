import z from "zod";


export const createFeedbackSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  authorId: z.string().uuid()
}).strict();

export const updateFeedbackByUserSchema = z.object({
  title: z.optional(z.string().min(1)),
  description: z.optional(z.string().min(1)),
  category: z.optional(z.string().min(1))
}).strict();

export const updateFeedbackStatusByAdminSchema = z.object({
  status: z.enum(["OPEN", "PLANNED", "IN_PROGRESS", "COMPLETED"])
}).strict();


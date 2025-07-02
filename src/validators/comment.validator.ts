import z from "zod";


export const createCommentSchema = z.object({
  content: z.string().min(1),
  feedbackId: z.string().uuid(),
  authorId: z.string().uuid()
}).strict();
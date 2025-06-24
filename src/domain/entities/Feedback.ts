export type FeedbackStatus = "OPEN" | "PLANNED" | "IN_PROGRESS" | "COMPLETED";


export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: string;
  status: FeedbackStatus;
  upvotes: number;
  authorId: string;
  createdAt: Date;
}
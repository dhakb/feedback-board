import type { Feedback } from "../entities/Feedback";


export interface CreateFeedbackDTO {
  title: string
  description: string,
  category: string,
  authorId: string
}


export interface IFeedbackRepository {
  create(data: CreateFeedbackDTO): Promise<Feedback>;

  findById(id: string): Promise<Feedback | null>;

  list(): Promise<Feedback[]>;

  upvote(id: string): Promise<void>;
}
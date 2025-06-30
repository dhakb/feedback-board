import type { Feedback, FeedbackStatus } from "../entities/Feedback";


export interface CreateFeedbackDTO {
  title: string
  description: string,
  category: string,
  authorId: string
}

export interface UpdateFeedbackDTO {
  title: string
  description: string,
  category: string,
  status: FeedbackStatus
}


export interface IFeedbackRepository {
  create(data: CreateFeedbackDTO): Promise<Feedback>;

  findById(id: string): Promise<Feedback | null>;

  list(): Promise<Feedback[]>;

  upvote(id: string): Promise<void>;

  delete(id: string): Promise<void>;

  update(id: string, data: Partial<UpdateFeedbackDTO>): Promise<Feedback>;
}